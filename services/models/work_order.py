# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import datetime

from django.db import models
from django.db.models import Q
from common_data.utilities import time_choices
from functools import reduce
from decimal import Decimal as D
from django.shortcuts import reverse
import invoicing
from services.models.requisition import ConsumablesRequisitionLine


class WorkOrderRequest(models.Model):
    created = models.DateField(blank=True, null=True)
    created_by = models.ForeignKey('employees.employee',
                                   null=True,
                                   on_delete=models.SET_NULL)
    invoice = models.ForeignKey('invoicing.invoice',
                                blank=True,
                                null=True,
                                on_delete=models.SET_NULL)
    service = models.ForeignKey('services.service', null=True,
                                on_delete=models.SET_NULL)
    status = models.CharField(max_length=16, choices=[
        ('request', 'Requested'),
        ('in-progress', 'In Progress'),
        ('completed', 'Completed'),
    ])
    description = models.TextField(blank=True, default="")

    def update_status(self):
        if self.work_orders.count() > 0:
            self.status = "in-progress"

        completed = True
        for wo in self.work_orders:
            if not wo.status in ['completed', 'authorized']:
                completed = False

        if completed:
            self.status = 'completed'

        self.save()

    @property
    def work_orders(self):
        return self.serviceworkorder_set.all()

    @property
    def invoice_line(self):
        qs = invoicing.models.InvoiceLine.objects.filter(invoice=self.invoice,
                                                         service__service=self.service)

        if qs.exists():
            return qs.first()

    def get_absolute_url(self):
        return reverse("services:work-order-request-detail",
                       kwargs={"pk": self.pk})


class ServiceWorkOrder(models.Model):
    STATUS_CHOICES = [
        ('requested', 'Requested'),
        ('progress', 'In progress'),
        ('completed', 'Completed'),
        ('authorized', 'Authorized'),
        ('declined', 'Declined')
    ]
    date = models.DateField()
    time = models.TimeField(choices=time_choices(
        '00:00:00', '23:30:00', '00:30:00'
    ))
    # for services done within the organization
    internal = models.BooleanField(default=False)

    works_request = models.ForeignKey('services.workorderrequest',
                                      blank=True, null=True, on_delete=models.SET_NULL)

    description = models.TextField(blank=True, default="")
    completed = models.DateTimeField(null=True, blank=True)
    expected_duration = models.DurationField(choices=time_choices(
        '00:00:00', '23:30:00', '00:30:00', delta=True
    ), null=True, blank=True)
    service_people = models.ManyToManyField('services.ServicePerson',
                                            limit_choices_to=Q(active=True),
                                            blank=True)
    team = models.ForeignKey('services.ServiceTeam', on_delete=models.SET_NULL, null=True,
                             blank=True)
    status = models.CharField(
        max_length=16, choices=STATUS_CHOICES, blank=True)
    authorized_by = models.ForeignKey('employees.Employee',
                                      on_delete=models.CASCADE, null=True,
                                      blank=True,
                                      limit_choices_to=Q(user__isnull=False))  # filter queryset
    notes = models.ManyToManyField('common_data.note')

    def __str__(self):
        return "WO{}".format(self.pk)  # TODO string padding

    @property
    def procedure_pk(self):
        if self.works_request.service.procedure:
            return self.works_request.service.procedure.pk

        return None

    @property
    def completed_tasks(self):
        return self.workordertask_set.filter(completed=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.works_request:
            self.works_request.update_status()

            procedure = self.works_request.service.procedure
            if procedure and self.workordertask_set.all().count() == 0:
                due = datetime.date.today()
                if self.works_request.invoice:
                    due = self.works_request.invoice.due

                for step in procedure.steps:
                    WorkOrderTask.objects.create(
                        work_order=self,
                        description=step.description,
                        due=due
                    )

    @property
    def number_of_employees(self):
        direct = self.service_people.all().count()
        team = 0
        if self.team:
            team = self.team.members.all().count()

        return direct + team

    @property
    def expenses(self):
        return self.workorderexpense_set.all()

    @property
    def unbilled_expenses(self):
        return self.workorderexpense_set.filter(
            expense__billable=False
        )

    @property
    def time_logs(self):
        # may decide to remove the .all() and use a filter of uses timesheet
        return self.timelog_set.all()

    @property
    def total_normal_time(self):
        return reduce(lambda x, y: x + y, [i.normal_time
                                           for i in self.time_logs], datetime.timedelta(seconds=0))

    @property
    def total_overtime(self):
        return reduce(lambda x, y: x + y,
                      [i.overtime for i in self.time_logs], datetime.timedelta(seconds=0))

    def get_absolute_url(self):
        return reverse("services:work-order-detail", kwargs={"pk": self.pk})

    @property
    def status_string(self):
        return dict(self.STATUS_CHOICES)[self.status]

    @property
    def consumables_used(self):
        return ConsumablesRequisitionLine.objects.filter(
            requisition__work_order=self
        )

    @property
    def total_expenses(self):
        return sum([i.expense.amount for i in self.expenses])

    @property
    def total_time(self):
        return self.total_overtime + self.total_normal_time


class TimeLog(models.Model):
    work_order = models.ForeignKey('services.serviceworkorder', null=True,
                                   on_delete=models.SET_NULL)
    employee = models.ForeignKey('employees.employee', null=True,
                                 on_delete=models.SET_NULL)
    date = models.DateField(default=datetime.date.today)
    normal_time = models.DurationField()
    overtime = models.DurationField()
    # using fields to perserve the cost in case the paygrade changes
    normal_time_cost = models.DecimalField(max_digits=16, decimal_places=2,
                                           default=D(0.0))
    overtime_cost = models.DecimalField(max_digits=16, decimal_places=2,
                                        default=D(0.0))

    @property
    def total_time(self):
        return self.overtime + self.normal_time

    @property
    def customer(self):
        if self.work_order.works_request.invoice:
            return \
                self.work_order.works_request.invoice.customer
        return 'Internal'

    def __str__(self):
        return f'{self.employee} {self.normal_time} + {self.overtime} O/T'

    @property
    def total_cost(self):
        return self.normal_time_cost + self.overtime_cost

    def save(self, *args, **kwargs):
        if not self.pk and self.employee.pay_grade is not None:
            self.normal_time_cost = D(self.employee.pay_grade.hourly_rate) * \
                self.normal_time.seconds / 3600
            self.overtime_cost = D(self.employee.pay_grade.overtime_rate) * \
                self.overtime.seconds / 3600

        super().save(*args, **kwargs)


class WorkOrderExpense(models.Model):
    work_order = models.ForeignKey('services.ServiceWorkOrder',
                                   on_delete=models.SET_NULL, null=True)
    expense = models.ForeignKey('accounting.Expense',
                                on_delete=models.SET_NULL, null=True)


class WorkOrderTask(models.Model):
    work_order = models.ForeignKey('services.ServiceWorkOrder',
                                   on_delete=models.CASCADE)
    assigned = models.ForeignKey('employees.Employee',
                                 on_delete=models.SET_NULL, null=True)
    description = models.TextField()
    due = models.DateField(blank=True)
    start = models.DateField(blank=True)
    dependency = models.ForeignKey('services.WorkOrderTask',
                                   on_delete=models.SET_NULL, null=True)
    completed = models.BooleanField(default=False)
