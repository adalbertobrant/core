# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.db.models import Q
from common_data.models import SingletonModel, SoftDeletionModel
import services
from decimal import Decimal as D

# Create your models here.


class ServicesSettings(SingletonModel):
    is_configured = models.BooleanField(default=False)


class Service(models.Model):
    # client and sales facing model
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    flat_fee = models.DecimalField(max_digits=16, decimal_places=2)
    hourly_rate = models.DecimalField(max_digits=16, decimal_places=2)
    category = models.ForeignKey('services.ServiceCategory',
                                 on_delete=models.SET_NULL, null=True,)
    procedure = models.ForeignKey('services.ServiceProcedure',
                                  on_delete=models.CASCADE, null=True, blank=True)
    frequency = models.CharField(max_length=16,
                                 choices=[("once", "Once off"),
                                          ("daily", "Daily"),
                                          ("weekly", "Weekly"),
                                          ("fortnightly", "Every 2 weeks"),
                                          ("monthly", "Monthly"),
                                          ("quarterly", "Every 3 Months"),
                                          ("bi-annually", "Every 6 Months"),
                                          ("yearly", "Yearly")])
    is_listed = models.BooleanField(default=False, blank=True)

    def __str__(self):
        return self.name

    @property
    def invoices(self):
        return [i.invoiceline.invoice for i in self.servicelinecomponent_set.filter(invoiceline__isnull=False)]

    @property
    def revenue(self):
        return sum([i.nominal_price for i in self.servicelinecomponent_set.filter(invoiceline__isnull=False)], 0)

    @property
    def average_revenue(self):
        if len(self.invoices) > 0:
            return sum([i.nominal_price for i in self.servicelinecomponent_set.filter(invoiceline__isnull=False)], D(0)) / \
                D(len(self.invoices))
        return D(0)

    @property
    def work_orders(self):
        return WorkOrder.objects.filter(works_request__service=self)

    @property
    def personnel(self):
        return [person for person in order.service_people
                for order in self.work_orders]


class ServiceCategory(models.Model):
    '''Used to organize services'''
    name = models.CharField(max_length=64)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

    @property
    def service_count(self):
        return self.service_set.all().count()

# might rename


class ServicePerson(SoftDeletionModel):
    employee = models.OneToOneField('employees.Employee',
                                    null=True,
                                    limit_choices_to=Q(active=True),
                                    on_delete=models.CASCADE)
    is_manager = models.BooleanField(default=False)
    can_authorize_equipment_requisitions = models.BooleanField(default=False)
    can_authorize_consumables_requisitions = models.BooleanField(default=False)

    def __str__(self):
        return self.name

    @property
    def name(self):
        return str(self.employee)

    @property
    def current_orders(self):
        return services.models.work_order.ServiceWorkOrder.objects.filter(Q(
            Q(status='requested') | Q(status='progress') | Q(status='declined')) & Q(
            Q(team__manager__id=self.id) | Q(service_people__in=[self.id])
        ))

    @property
    def teams(self):
        teams = []
        for team in ServiceTeam.objects.all():
            if team.manager and team.manager.pk == self.pk:
                teams.append(team)
            if self.pk in [i.pk for i in team.members.all()]:
                teams.append(team)

        return teams

    @property
    def completed_orders(self):
        return services.models.work_order.ServiceWorkOrder.objects.filter(Q(
            Q(status='completed') | Q(status='authorized')) & Q(
            Q(team__manager=self) | Q(service_people__in=[self.id])
        ))


class ServiceTeam(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    manager = models.ForeignKey('services.ServicePerson',
                                on_delete=models.SET_NULL,
                                null=True,
                                limit_choices_to=Q(active=True),
                                blank=True,
                                related_name="service_team_manager")
    members = models.ManyToManyField('services.ServicePerson',
                                     related_name="service_team_members",
                                     limit_choices_to=Q(active=True),
                                     )

    def __str__(self):
        return self.name

    @property
    def hours_worked(self):
        return sum([i.total_normal_time.seconds + i.total_overtime.seconds for i in self.serviceworkorder_set.all()]) / 3600.0

    @property
    def current_jobs(self):
        return self.serviceworkorder_set.filter(Q(status='requested') | Q(status='progress'))

    @property
    def completed_jobs(self):
        return self.serviceworkorder_set.all().exclude(Q(status='requested') | Q(status='progress'))
