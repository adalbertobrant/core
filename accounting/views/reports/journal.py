import datetime
import os
import urllib

from django.urls import reverse_lazy
from django.views.generic import TemplateView
from django.views.generic.edit import FormView

from common_data.utilities import (ContextMixin,
                                   extract_period,
                                   MultiPageDocument,
                                   PeriodReportMixin,
                                   ConfigMixin)
from wkhtmltopdf.views import PDFTemplateView
from accounting import forms, models


class JournalFormView(ContextMixin, FormView):
    form_class = forms.JournalReportForm
    template_name = os.path.join(
        'common_data', 'reports', 'report_template.html')

    extra_context = {
        'action': reverse_lazy('accounting:journal-report'),
    }

    def get_initial(self):
        return {
            'journal': self.kwargs['pk']
        }


class JournalReport(ConfigMixin,
                    MultiPageDocument,
                    PeriodReportMixin,
                    TemplateView):
    template_name = os.path.join('accounting', 'reports',
                                 'journal', 'report.html')
    page_length = 10

    def get_multipage_queryset(self):
        j_no = self.request.GET['journal']
        journal = models.Journal.objects.get(pk=j_no)
        start, end = extract_period(self.request.GET)
        return models.JournalEntry.objects.filter(
            journal=journal,
            draft=False,
            date__gte=start,
            date__lte=end)

    @staticmethod
    def common_context(context, start, end):
        journal = models.Journal.objects.get(pk=context['journal'])

        context.update({
            'start': start.strftime("%d %B %Y"),
            'end': end.strftime("%d %B %Y"),
            'journal': journal,
            'currency': models.AccountingSettings.objects.first().active_currency
        })
        return context

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        kwargs = self.request.GET
        start, end = extract_period(kwargs)

        context['pdf_link'] = True
        context['journal'] = kwargs['journal']
        # sales
        return JournalReport.common_context(context, start, end)


class JournalReportPDFView(ConfigMixin, MultiPageDocument, PDFTemplateView):
    template_name = JournalReport.template_name
    page_length = JournalReport.page_length

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        context['journal'] = self.kwargs['journal']
        start = datetime.datetime.strptime(urllib.parse.unquote(
            self.kwargs['start']), "%d %B %Y")
        end = datetime.datetime.strptime(urllib.parse.unquote(
            self.kwargs['end']), "%d %B %Y")
        return JournalReport.common_context(context, start, end)

    def get_multipage_queryset(self):
        j_no = self.kwargs['journal']
        journal = models.Journal.objects.get(pk=j_no)
        start = datetime.datetime.strptime(urllib.parse.unquote(
            self.kwargs['start']), "%d %B %Y")
        end = datetime.datetime.strptime(urllib.parse.unquote(
            self.kwargs['end']), "%d %B %Y")
        return models.JournalEntry.objects.filter(
            journal=journal,
            date__gte=start,
            date__lte=end)
