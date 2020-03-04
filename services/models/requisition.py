# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.db.models import Q
from django.shortcuts import reverse
from decimal import Decimal as D
from inventory.models import WareHouseItem


class BaseRequisition(models.Model):
    class Meta:
        abstract = True

    date = models.DateField()
    warehouse = models.ForeignKey('inventory.WareHouse',
                                  on_delete=models.CASCADE, default=1)
    department = models.ForeignKey('employees.department',
                                   null=True,
                                   on_delete=models.SET_NULL,
                                   blank=True)
    reference = models.CharField(max_length=255)
    work_order = models.ForeignKey('services.serviceworkorder', null=True,
                                   limit_choices_to=Q(
                                       Q(status="progress") | Q(status="requested")),
                                   on_delete=models.SET_NULL)

    def __str__(self):
        return '%s: %s' % (self.date, self.reference)

    def get_absolute_url(self):
        return reverse("services:work-order-detail", kwargs={"pk": self.work_order.pk})


class EquipmentRequisition(BaseRequisition):
    requested_by = models.ForeignKey('employees.Employee', limit_choices_to=Q(active=True),
                                     on_delete=models.CASCADE,
                                     related_name='requested_by')
    authorized_by = models.ForeignKey('employees.Employee',
                                      related_name='authorized_by', on_delete=models.CASCADE, null=True)  # filter queryset
    released_by = models.ForeignKey('employees.Employee',
                                    related_name='released_by', on_delete=models.CASCADE, null=True)
    returned_date = models.DateField(null=True)
    received_by = models.ForeignKey('employees.Employee',
                                    related_name='received_by', on_delete=models.CASCADE, null=True)

    @property
    def status(self):
        if self.received_by:
            return 'Returned'
        elif self.released_by:
            return 'Released'
        elif self.authorized_by:
            return 'Authorized'
        else:
            return 'Requested'


class EquipmentRequisitionLine(models.Model):
    CONDITION_CHOICES = [
        ('excellent', 'Excellent'),
        ('good', 'Good'),
        ('poor', 'Poor'),
        ('broken', 'Not Functioning')
    ]
    equipment = models.ForeignKey('inventory.InventoryItem',
                                  on_delete=models.SET_NULL, null=True,)
    quantity = models.FloatField()
    quantity_returned = models.FloatField(default=0)
    requesting_condition = models.CharField(max_length=16,
                                            choices=CONDITION_CHOICES)
    returned_condition = models.CharField(max_length=16,
                                          choices=CONDITION_CHOICES, null=True)
    requisition = models.ForeignKey('services.EquipmentRequisition',
                                    on_delete=models.CASCADE)

    def __str__(self):
        return str(self.equipment)


class ConsumablesRequisition(BaseRequisition):
    requested_by = models.ForeignKey('employees.Employee', limit_choices_to=Q(active=True),
                                     related_name='consumable_requested_by', on_delete=models.SET_NULL, null=True)
    authorized_by = models.ForeignKey('employees.Employee',
                                      related_name='consumable_authorized_by', on_delete=models.SET_NULL,  null=True)  # filter queryset
    released_by = models.ForeignKey('employees.Employee',
                                    related_name='consumable_released_by', on_delete=models.SET_NULL, null=True)

    @property
    def status(self):
        if self.released_by:
            return 'Released'
        elif self.authorized_by:
            return 'Authorized'
        else:
            return 'Requested'

    def release_inventory(self):
        for line in self.consumablesrequisitionline_set.all():
            wiqs = WareHouseItem.objects.filter(
                warehouse=self.warehouse, item=line.consumable)
            if not wiqs.exists():
                wi = WareHouseItem.objects.create(
                    warehouse=self.warehouse,
                    item=line.consumable,
                    quantity=0,
                )
            else:
                wi = wiqs.first()

            wi.decrement(line.quantity)


class ConsumablesRequisitionLine(models.Model):
    consumable = models.ForeignKey(
        'inventory.InventoryItem', on_delete=models.SET_NULL, null=True)
    unit = models.ForeignKey('inventory.UnitOfMeasure',
                             on_delete=models.SET_NULL, null=True)
    quantity = models.FloatField()
    returned = models.FloatField(default=0.0)
    requisition = models.ForeignKey('services.ConsumablesRequisition',
                                    on_delete=models.CASCADE)

    def __str__(self):
        return str(self.consumable)

    @property
    def line_value(self):
        return D(self.quantity - self.returned) * \
            self.consumable.consumable_unit_value
