from django.views.generic import TemplateView
import os
import datetime
from invoicing import models
from common_data.views import PDFTemplateView
from common_data.utilities.mixins import ContextMixin, ConfigMixin 
from .report_utils.plotters import (plot_leads_by_source,
                                    plot_leads_by_status,
                                    plot_leads_by_owner,
                                    plot_activities)

class LeadsBySourceReport(ContextMixin,ConfigMixin,TemplateView):
    template_name = os.path.join('invoicing', 'crm', 'reports', 'leads_by_source', 'report.html')

    @staticmethod
    def common_context():
        context = {}
        context['sources'] = models.LeadSource.objects.all()
        context['date'] = datetime.date.today()

        context['chart'] = plot_leads_by_source()
        return context

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        context['pdf_link'] = True
        context.update(LeadsBySourceReport.common_context())
        return context



class LeadsBySourcePDFView(ConfigMixin, PDFTemplateView):
    template_name = LeadsBySourceReport.template_name
    file_name = "leads_by_source.pdf"

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        context.update(LeadsBySourceReport.common_context())
        return context

class LeadsByStatusReport(ContextMixin,ConfigMixin,TemplateView):
    template_name = os.path.join('invoicing', 'crm', 'reports', 'leads_by_status', 'report.html')

    @staticmethod
    def common_context():
        context = {}
        context['lead'] = models.Lead.objects.filter(status='lead')
        context['qualified'] = models.Lead.objects.filter(status='qualified')
        context['quotation'] = models.Lead.objects.filter(status='quotation')
        context['won'] = models.Lead.objects.filter(status='won')
        context['lost'] = models.Lead.objects.filter(status='lost')
        context['date'] = datetime.date.today()

        context['chart'] = plot_leads_by_status()
        return context

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        context.update(LeadsByStatusReport.common_context())
        context['pdf_link'] = True

        return context

class LeadsByStatusPDFView(ConfigMixin, PDFTemplateView):
    template_name = LeadsByStatusReport.template_name
    file_name = "leads_by_status.pdf"

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        context.update(LeadsByStatusReport.common_context())
        return context



class LeadsByOwnerReport(ContextMixin,ConfigMixin,TemplateView):
    template_name = os.path.join('invoicing', 'crm', 'reports', 'leads_by_owner', 'report.html')

    @staticmethod
    def common_context():
        context = {}
        context['reps'] = models.SalesRepresentative.objects.all()
        context['date'] = datetime.date.today()

        context['chart'] = plot_leads_by_owner()
        return context 

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        context.update(LeadsByOwnerReport.common_context())
        context['pdf_link'] = True

        return context


class LeadsByOwnerPDFView(ConfigMixin, PDFTemplateView):
    template_name = LeadsByOwnerReport.template_name
    file_name = "leads_by_owner.pdf"

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        context.update(LeadsByOwnerReport.common_context())
        return context



class SalesActivitiesReport(ContextMixin,ConfigMixin,TemplateView):
    template_name = os.path.join('invoicing', 'crm', 'reports', 'activities', 'report.html')

    @staticmethod
    def common_context():
        context = {}
        today = datetime.date.today()
        start = today - datetime.timedelta(days=30)
        context['leads'] = models.Lead.objects.filter(created__gte=start,
            created__lte=today)
        context['date'] = today
        context['tasks'] = models.Task.objects.filter(created__gte=start,
            created__lte=today)
        context['interactions'] = models.Interaction.objects.filter(
            timestamp__gte=datetime.datetime.combine(start, datetime.time.min),
            timestamp__lte=datetime.datetime.combine(today, datetime.time.max))

        context['daily_leads'] = context['leads'].count() / 30.0
        context['daily_interactions'] = context['interactions'].count() / 30.0
        context['daily_tasks_created'] = context['tasks'].count() / 30.0
        context['daily_tasks_completed'] = context['tasks'].filter(
            status='completed').count() / 30.0


        context['charts'] = plot_activities()
        return context 

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        context.update(SalesActivitiesReport.common_context())
        context['pdf_link'] = True
        return context


class SalesActivitiesPDFView(ConfigMixin, PDFTemplateView):
    template_name = SalesActivitiesReport.template_name
    file_name = "sales activities report.pdf"

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        context.update(SalesActivitiesReport.common_context())
        return context