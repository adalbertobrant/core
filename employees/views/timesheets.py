import datetime
import json
import os
import urllib

from django.contrib import messages
from django.urls import reverse_lazy
from django.views.generic import DetailView, TemplateView
from django.views.generic.edit import (CreateView, DeleteView, FormView,
                                       UpdateView)
from django_filters.views import FilterView
from rest_framework.response import Response as DRFResponse
from rest_framework import viewsets, status,generics
from django.http import Http404

from common_data.utilities import ContextMixin
from common_data.views import PaginationMixin

from employees import filters, forms, models, serializers
from django.http import JsonResponse
from django.db.models import Q

CREATE_TEMPLATE = os.path.join('common_data', 'create_template.html')


class TimeSheetMixin(object):
    def post(self, request, *args, **kwargs):
        resp = super().post(request, *args, **kwargs)
        update_flag = isinstance(self, UpdateView)

        def get_time(time_string):
            if '.' in time_string:
                time_string = time_string.split(
                    '.')[0]  # removes seconds component
            try:
                return datetime.datetime.strptime(time_string, '%H:%M').time()
            except:
                return datetime.datetime.strptime(time_string, '%H:%M:%S').time()

        def get_duration(time_string):
            try:
                hr, min = time_string.split(":")
            except:
                hr, min, sec = time_string.split(":")
            return datetime.timedelta(hours=int(hr), minutes=int(min))

        if not self.object:
            return resp

        raw_data = request.POST['lines']
        line_data = json.loads(urllib.parse.unquote(raw_data))

        if update_flag and len(line_data) > 0:
            for i in self.object.attendanceline_set.all():
                i.delete()

        for line in line_data:
            if isinstance(line['date'], str) and '-' in line['date']:
                date = datetime.datetime.strptime(
                    line['date'], '%Y-%m-%d')
            else:
                date = datetime.date(
                    self.object.year,
                    self.object.month,
                    int(line['date']))

            models.AttendanceLine.objects.create(
                timesheet=self.object,
                date=date,
                time_in=get_time(line['timeIn']),
                time_out=get_time(line['timeOut']),
                lunch_duration=get_duration(line['breaksTaken']))

        return resp


class CreateTimeSheetView(TimeSheetMixin, CreateView):
    template_name = os.path.join(
        'employees', 'timesheet', 'create_update.html')
    form_class = forms.TimesheetForm


class ListTimeSheetView(ContextMixin,  PaginationMixin, FilterView):
    template_name = os.path.join('employees', 'timesheet', 'list.html')
    filterset_class = filters.TimeSheetFilter
    paginate_by = 20
    extra_context = {
        'title': 'Time Sheets',
        'new_link': reverse_lazy('employees:timesheet-create')
    }
    def get_queryset(self):

        return models.EmployeeTimeSheet.objects.all().order_by('pk').reverse()


class TimeSheetDetailView(DetailView):
    model = models.EmployeeTimeSheet
    template_name = os.path.join('employees', 'timesheet', 'detail.html')


class TimeSheetUpdateView(TimeSheetMixin,  UpdateView):
    template_name = os.path.join(
        'employees', 'timesheet', 'create_update.html')
    form_class = forms.TimesheetForm
    queryset = models.EmployeeTimeSheet.objects.all()


class TimeSheetViewset(viewsets.ModelViewSet):
    queryset = models.EmployeeTimeSheet.objects.all()
    serializer_class = serializers.TimeSheetSerializer

class AttendanceLineViewset(viewsets.ModelViewSet):
    queryset = models.AttendanceLine.objects.all()
    serializer_class = serializers.AttendanceLineSerializer

# For the mobile app
class LatestAttendanceLineView(generics.GenericAPIView):
    model = models.AttendanceLine
    serializer_class = serializers.AttendanceLineSerializer

    def get_queryset(self):
        employee = models.Employee.objects.get(
            pk=self.kwargs['employee'])
        lines = models.AttendanceLine.objects.filter(
            timesheet__employee=employee)
        if not lines.exists():
            raise Http404
        return lines.latest('pk')
        
    def get(self, *args, **kwargs):
        try:
            qs = self.get_queryset()
        except Http404:
            return DRFResponse(status=status.HTTP_404_NOT_FOUND)
        
        data = self.serializer_class(qs).data
        return DRFResponse(data)



class TimeLoggerView(ContextMixin, TemplateView):
    template_name = os.path.join('employees', 'timesheet', 'logger.html')


def get_current_shift_api(request):
    
    now  = datetime.datetime.now()
    sched_qs = models.ShiftScheduleLine.objects.filter(
        start_time__lte=now.time(),
        end_time__gt=now.time(),
        schedule__valid_from__lte=now.date(),
        schedule__valid_to__gte=now.date()
    )
    shifts = []
    for line in sched_qs:
        if line.date_on_shift(now.date()):
            shifts.append(line.shift)

    shifts = [serializers.ShiftSerializer(shift, many=False).data for shift in shifts]

    return JsonResponse(shifts, safe=False)

def timesheet_login(request):
    data = json.loads(request.body)
    e_num = data['employee']
    employee = models.Employee.objects.get(pk=e_num)

    if data['pin'] != str(employee.pin):
        return JsonResponse({'status': 'incorrect pin'})

    # check if a timesheet for this employee for this month exists, if not
    # create a new one. Check if today has a attendance line if not create a new
    # one. Check if this line has been logged in, if so log out if not log in.
    NOW = datetime.datetime.now().time()
    TODAY = datetime.date.today()

    sheet_filters = Q(Q(employee=employee) &
                        Q(month=TODAY.month) &
                        Q(year=TODAY.year))
    ts_qs = models.EmployeeTimeSheet.objects.filter(sheet_filters)
    if ts_qs.exists():
        curr_sheet = ts_qs.first()
    else:
        curr_sheet = models.EmployeeTimeSheet.objects.create(
            employee=employee,
            month=TODAY.month,
            year=TODAY.year
        )

    line_qs = models.AttendanceLine.objects.filter(
            Q(timesheet=curr_sheet) &
            Q(date=TODAY)
    )
    if line_qs.exists():
        curr_line = line_qs.first()
    
    else:
        curr_line = models.AttendanceLine.objects.create(
            timesheet=curr_sheet,
            date=TODAY
        )

    if curr_line.time_in is None:
        curr_line.time_in = NOW
        curr_line.save()
        return JsonResponse({
            'status': 'ok',
            'value': 'in'
            })

    else:
        curr_line.time_out = NOW
        curr_line.save()
        return JsonResponse({
            'status': 'ok',
            'value': 'out'
            })
