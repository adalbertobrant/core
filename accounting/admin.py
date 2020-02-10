# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

from accounting import models

admin.site.register(models.Account)
admin.site.register(models.Debit)
admin.site.register(models.Credit)
admin.site.register(models.JournalEntry)
admin.site.register(models.Journal)
admin.site.register(models.Bill)
admin.site.register(models.BillLine)
admin.site.register(models.BillPayment)
admin.site.register(models.Bookkeeper)
