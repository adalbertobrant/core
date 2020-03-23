
import datetime
from django.db import models

from django.shortcuts import reverse
from common_data.models import SingletonModel

class EmployeeTimeSheet(models.Model):
    MONTH_CHOICES = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ]
    YEAR_CHOICES = [
        (i, i) for i in range(2000, 2051)
    ]
    employee = models.ForeignKey('employees.employee', on_delete=models.
                                 SET_NULL, null=True,
                                 related_name='target')
    month = models.PositiveSmallIntegerField(choices=enumerate(MONTH_CHOICES,
                                                               start=1))
    year = models.PositiveSmallIntegerField(choices=YEAR_CHOICES)
    recorded_by = models.ForeignKey('employees.employee', on_delete=models.
                                    SET_NULL, related_name='recorder', null=True)
    complete = models.BooleanField(default=False, blank=True)

    @property
    def normal_hours(self):
        total = datetime.timedelta(seconds=0)
        for line in self.attendanceline_set.all():
            total += line.normal_time

        return total

    @property
    def overtime(self):
        total = datetime.timedelta(seconds=0)
        for line in self.attendanceline_set.all():
            total += line.overtime

        return total

    @property
    def lines(self):
        return AttendanceLine.objects.filter(timesheet=self).order_by('date')

    def get_absolute_url(self):
        return reverse("employees:timesheet-detail", kwargs={"pk": self.pk})


    @property 
    def enumerate_ts(self):
        data = []
        for i in range(1,32):
            try:
                date = datetime.date(year=self.year, month=self.month, day=i)
            except: 
                data.append(2)
                continue
            qs = AttendanceLine.objects.filter(
                    timesheet=self,date=date)
            if qs.exists():
                line = qs.first()
                data.append(1 if line.late else 0)
                continue
            data.append(2)
            
        return data
class AttendanceLine(models.Model):
    timesheet = models.ForeignKey(
        'employees.EmployeeTimeSheet', on_delete=models.SET_NULL, null=True)
    date = models.DateField()
    time_in = models.TimeField(blank=True, null=True)
    time_out = models.TimeField(blank=True, null=True)
    lunch_duration = models.DurationField(null=True, blank=True)

    @property
    def late(self):
        #determined from shift data
        shifts = self.timesheet.employee.shift_set.all()
        if shifts.count() == 0:
            return False

        for shift in shifts:
            for line in shift.shiftscheduleline_set.all():
                if line.date_on_shift(self.date):
                    return self.time_in > line.start_time
        
        return False

    def to_datetime(self, time):
        return datetime.datetime.combine(self.date, time)

    @property
    def total_time(self):
        try:
            return self.to_datetime(self.time_out) - self.to_datetime(self.time_in)
        except:
            return datetime.timedelta(seconds=0)
        

    @property
    def working_time(self):
        if self.lunch_duration:
            return self.total_time - self.lunch_duration

        return self.total_time

    @property
    def normal_time(self):
        if (self.working_time.seconds / 3600) > 8:
            return datetime.timedelta(hours=8)

        return self.working_time

    @property
    def overtime(self):
        if (self.working_time.seconds / 3600) > 8:
            return self.working_time - datetime.timedelta(hours=8)

        return datetime.timedelta(seconds=0)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.lunch_duration is None and self.timesheet.employee.pay_grade:
            self.lunch_duration = self.timesheet.employee.pay_grade.lunch_duration
            self.save()

class Shift(models.Model):
    name = models.CharField(max_length=255)
    supervisor = models.ForeignKey('employees.Employee',
                                   on_delete=models.SET_NULL, null=True,
                                   related_name='supervisor')
    employees = models.ManyToManyField('employees.Employee')

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse("employees:detail-shift", kwargs={"pk": self.pk})
    


class ShiftSchedule(models.Model):
    name = models.CharField(max_length=255)
    valid_from = models.DateField()
    valid_to = models.DateField()

    def __str__(self):
        return self.name

    @property
    def shifts(self):
        return ShiftScheduleLine.objects.filter(schedule=self)

    def get_absolute_url(self):
        return reverse("employees:detail-shift-schedule", kwargs={"pk": self.pk})
    


class ShiftScheduleLine(models.Model):
    schedule = models.ForeignKey(
        'employees.ShiftSchedule', on_delete=models.SET_NULL, null=True)
    start_time = models.TimeField()
    end_time = models.TimeField()
    monday = models.BooleanField(default=True)
    tuesday = models.BooleanField(default=True)
    wednesday = models.BooleanField(default=True)
    thursday = models.BooleanField(default=True)
    friday = models.BooleanField(default=True)
    saturday = models.BooleanField(default=False)
    sunday = models.BooleanField(default=False)
    shift = models.ForeignKey('employees.Shift',
                              on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return str(self.schedule) + ' ' + str(self.shift)

    def date_on_shift(self, date):
        mapping = {
            0: self.monday,
            1: self.tuesday,
            2:self.wednesday,
            3:self.thursday,
            4:self.friday,
            5:self.saturday,
            6:self.sunday
        }
        return mapping[date.weekday()]

'''
====================================================
| Shift  | Start | End  | M | T | W | T | F | S | S |
====================================================
|Shift 1 | 00:00 |12:00 | x | x | x | x | x | / | / |
-----------------------------------------------------
|Shift 2 | 00:00 |12:00 | / | / | x | x | x | x | x |
-----------------------------------------------------
'''