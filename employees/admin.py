# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin
from employees import models
# Register your models here.

admin.site.register(models.Employee)
admin.site.register(models.PayrollOfficer)


