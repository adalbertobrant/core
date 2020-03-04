import datetime
from decimal import Decimal as D
import os
import urllib

from django.urls import reverse_lazy
from django.views.generic import TemplateView
from django.views.generic.edit import FormView

from common_data.utilities import (ContextMixin,
                                   MultiPageDocument,
                                   extract_period,
                                   PeriodReportMixin,
                                   ConfigMixin)
from wkhtmltopdf.views import PDFTemplateView
from accounting import forms, models


class ExpenseReportFormView(ContextMixin, FormView):
    form_class = forms.PeriodReportForm
    template_name = os.path.join(
        'common_data', 'reports', 'report_template.html')

    extra_context = {
        'action': reverse_lazy('accounting:expense-summary'),
    }


class ExpenseReport(ConfigMixin,
                    PeriodReportMixin,
                    TemplateView,
                    ):
    template_name = os.path.join('accounting', 'reports',
                                 'expense', 'report.html')

    @staticmethod
    def common_context(context, start, end):

        context.update({
            'start': start.strftime("%d %B %Y"),
            'end': end.strftime("%d %B %Y"),
            # total expenses
        })
        expenses = models.Expense.objects.filter(
            date__gte=start, date__lte=end)
        data = {}
        for exp in expenses:
            data.setdefault(exp.category_string, {
                'name': exp.category_string,
                'expenses': [],
                'total': D(0)
            })
            data[exp.category_string]['expenses'].append(exp)

        for key in data:
            data[key]['total'] = sum([e.amount
                                      for e in data[key]['expenses']], D(0))

        context['categories'] = data.values()
        context['total_expenses'] = sum([i['total'] for i in data.values()])

        return context

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        kwargs = self.request.GET
        start, end = extract_period(kwargs)

        context['pdf_link'] = True

        return ExpenseReport.common_context(context, start, end)


class ExpenseReportPDFView(ConfigMixin, PDFTemplateView):
    template_name = ExpenseReport.template_name

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)

        start = datetime.datetime.strptime(urllib.parse.unquote(
            self.kwargs['start']), "%d %B %Y")
        end = datetime.datetime.strptime(urllib.parse.unquote(
            self.kwargs['end']), "%d %B %Y")
        return ExpenseReport.common_context(context, start, end)
