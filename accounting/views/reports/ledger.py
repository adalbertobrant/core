import datetime
from decimal import Decimal as D
import os
from functools import reduce
import urllib
from itertools import chain

from django.db.models import Q
from django.urls import reverse_lazy
from django.views.generic import DetailView, TemplateView
from django.views.generic.edit import FormView
from common_data.forms import PeriodReportForm
from django.http import HttpResponseRedirect

from common_data.forms import PeriodReportForm
from common_data.utilities import (ContextMixin, 
                                    MultiPageDocument,
                                    extract_period, 
                                    PeriodReportMixin,
                                    ConfigMixin)
from invoicing import models as inv
from inventory import models as inventory_models
from wkhtmltopdf.views import PDFTemplateView
from accounting import forms, models

from django.test import Client
import csv

class GeneralLedgerFormView(ContextMixin, FormView):
    form_class = forms.PeriodReportForm
    template_name = os.path.join('common_data', 'reports', 'report_template.html')
    
    extra_context = {
        'action': reverse_lazy('accounting:general-ledger'),
    }

class GeneralLedger(ConfigMixin,
                    PeriodReportMixin,  
                    TemplateView,
                    ):
    template_name = os.path.join('accounting', 'reports', 
        'ledger', 'report.html')

    @staticmethod
    def common_context(context, start, end):
        
        context.update({
            'start': start.strftime("%d %B %Y"),
            'end': end.strftime("%d %B %Y"),
            #total expenses
        })
        credits = models.Credit.objects.filter(entry__date__gte=start,
            entry__date__lte=end,entry__draft=False)

        debits = models.Debit.objects.filter(entry__date__gte=start,
            entry__date__lte=end,entry__draft=False)
        data = {}

        def iterate_transactions(transactions, data):
            for entry in transactions:
                data.setdefault(str(entry.account), {
                    'name': str(entry.account),
                    'transactions': [],
                    'credit': D(0),
                    'debit': D(0)
                })
                data[str(entry.account)]['transactions'].append(entry)
                if entry.is_debit:
                    data[str(entry.account)]['debit'] += entry.amount
                else:
                    data[str(entry.account)]['credit'] += entry.amount


        iterate_transactions(credits, data)
        iterate_transactions(debits, data)
        context['accounts'] = sorted(data.values(), key=lambda x: x['name'])
        net_movement = {'debit': False, 'amount': D(0)}
        for account in context['accounts']:
            account['net_movement'] = {
                'debit': account['debit'] > account['credit'],
                'amount': abs(account['debit'] - account['credit'])
            }
        
        

        
        return context


    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        kwargs =  self.request.GET
        start, end = extract_period(kwargs)
        
        context['pdf_link'] = True
        
        return GeneralLedger.common_context(context, start, end)

class GeneralLedgerPDFView(ConfigMixin, PDFTemplateView):
    template_name = GeneralLedger.template_name


    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)

        start = datetime.datetime.strptime(urllib.parse.unquote(
            self.kwargs['start']), "%d %B %Y")
        end = datetime.datetime.strptime(urllib.parse.unquote(
            self.kwargs['end']), "%d %B %Y")
        return GeneralLedger.common_context(context, start, end)