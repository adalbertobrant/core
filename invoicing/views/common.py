# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import os
import datetime

from django.conf import settings
from django.db.models import Q
from django.http import HttpResponseRedirect
from django.urls import reverse_lazy
from django.views.generic import TemplateView, ListView
from django.views.generic.edit import UpdateView, CreateView
from rest_framework import generics

from common_data.utilities import ConfigWizardBase
from common_data.utilities.mixins import ContextMixin
from invoicing import forms, serializers
from invoicing.models import *
from invoicing.views.report_utils import plotters
from django.conf import settings
from django.core.files.storage import FileSystemStorage
from employees.models import Employee
from employees.forms import EmployeeForm

class SalesConfigMixin(object):
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context.update(SalesConfig.objects.first().__dict__)
        return context


class Home(SalesConfigMixin, TemplateView):
    template_name = os.path.join("invoicing", "dashboard.html")

    def get(self, *args, **kwargs):
        if SalesConfig.objects.first().is_configured:
            return super().get(*args, **kwargs)
        else:
            return HttpResponseRedirect(reverse_lazy('invoicing:config-wizard'))


class AsyncDashboard(TemplateView):
    template_name = os.path.join('invoicing', 'async_dashboard.html')

    def get_context_data(self, **kwargs):
        TODAY = datetime.date.today()

        context = super().get_context_data(**kwargs)
        first = TODAY - datetime.timedelta(days=TODAY.day)
        context['sales_to_date'] = sum([i.total for i in
                                        Invoice.objects.filter(Q(
                                            Q(status="invoice") |
                                            Q(status="paid") |
                                            Q(status='paid-partially')
                                        ) &
                                            Q(date__gt=first))])
        context['customers'] = Customer.objects.filter(active=True).count()
        context['outstanding_invoices'] = Invoice.objects.filter(Q(
            status="invoice") | Q(status="paid-partially")).count()

        context['money_owed'] = sum([i.total_due for i in
                                     Invoice.objects.filter(Q(status="invoice") | Q(
                                         status="paid-partially"))])

        context['overdue'] = Invoice.objects.filter(Q(Q(
            status="invoice") | Q(status="paid-partially")) & Q(
                due__gt=TODAY
        )).count()

        context['graph'] = plotters.plot_sales(
            datetime.date.today() - datetime.timedelta(days=30),
            datetime.date.today()
        )
        return context


#########################################################
#                  Template Views                       #
#########################################################


class ConfigView(UpdateView):
    template_name = os.path.join("invoicing", "config.html")
    form_class = forms.SalesConfigForm
    model = SalesConfig
    success_url = reverse_lazy('invoicing:home')


class ConfigAPIView(generics.RetrieveAPIView):
    queryset = SalesConfig.objects.all()
    serializer_class = serializers.ConfigSerializer


class PaymentMethodAPIView(generics.RetrieveAPIView):
    queryset = PaymentMethod.objects.all()
    serializer_class = serializers.PaymentMethodSerializer


def employee_condition(self):
    return Employee.objects.all().count() == 0


def rep_condition(self):
    return SalesRepresentative.objects.all().count() == 0


class ConfigWizard(ConfigWizardBase):
    template_name = os.path.join('invoicing', 'wizard.html')
    form_list = [
        forms.SalesConfigForm,
        forms.CustomerForm,
        EmployeeForm,
        forms.SalesRepForm
    ]

    condition_dict = {
        '2': employee_condition,
        '3': rep_condition
    }

    file_storage = FileSystemStorage(
        location=os.path.join(settings.MEDIA_ROOT, 'logo'))

    config_class = SalesConfig
    success_url = reverse_lazy('invoicing:home')

    def get_form_initial(self, step):
        initial = super().get_form_initial(step)
        if step == '1':
            initial.update({'customer_type': 'individual'})

        return initial


class CreatePaymentMethod(ContextMixin, CreateView):
    extra_context = {
        'title': 'Create Payment Method'
    }
    template_name = os.path.join('common_data', 'create_template.html')
    model = PaymentMethod
    fields = '__all__'
    success_url = reverse_lazy('invoicing:list-payment-methods')

class UpdatePaymentMethod(ContextMixin, UpdateView):
    extra_context = {
        'title': 'Edit Payment Method'
    }
    template_name  = os.path.join('common_data', 'create_template.html')
    model = PaymentMethod
    fields = '__all__'
    success_url = reverse_lazy('invoicing:list-payment-methods')

class PaymentMethodList(ContextMixin, ListView):
    template_name = os.path.join('invoicing', 'payment_method','list.html')
    queryset = PaymentMethod.objects.all()
    extra_context = {
        'new_link': reverse_lazy('invoicing:create-payment-method')
    }