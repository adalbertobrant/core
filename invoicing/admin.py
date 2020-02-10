# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

from .models import *

admin.site.register(Customer)
admin.site.register(SalesRepresentative)
admin.site.register(POSSession)
admin.site.register(Invoice)
admin.site.register(InvoiceLine)
admin.site.register(Lead)
admin.site.register(Interaction)
admin.site.register(Task)
admin.site.register(SalesTeam)
admin.site.register(Note)
admin.site.register(LeadSource)
admin.site.register(InteractionType)
