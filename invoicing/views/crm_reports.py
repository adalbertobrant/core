from django.views.generic import TemplateView
import os
import datetime
from invoicing import models
from common_data.utilities.mixins import ContextMixin, ConfigMixin 
from .report_utils.plotters import (plot_leads_by_source,
                                    plot_leads_by_status,
                                    plot_leads_by_owner,
                                    plot_activities)

class LeadsBySourceReport(ContextMixin,ConfigMixin,TemplateView):
    template_name = os.path.join('invoicing', 'crm', 'reports', 'leads_by_source', 'report.html')

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        context['sources'] = models.LeadSource.objects.all()
        context['date'] = datetime.date.today()

        context['chart'] = plot_leads_by_source()
        context['pdf_link'] = True

        return context


class LeadsByStatusReport(ContextMixin,ConfigMixin,TemplateView):
    template_name = os.path.join('invoicing', 'crm', 'reports', 'leads_by_status', 'report.html')

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        context['lead'] = models.Lead.objects.filter(status='lead')
        context['qualified'] = models.Lead.objects.filter(status='qualified')
        context['quotation'] = models.Lead.objects.filter(status='quotation')
        context['won'] = models.Lead.objects.filter(status='won')
        context['lost'] = models.Lead.objects.filter(status='lost')
        context['date'] = datetime.date.today()

        context['chart'] = plot_leads_by_status()
        context['pdf_link'] = True

        return context



class LeadsByOwnerReport(ContextMixin,ConfigMixin,TemplateView):
    template_name = os.path.join('invoicing', 'crm', 'reports', 'leads_by_owner', 'report.html')

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        context['reps'] = models.SalesRepresentative.objects.all()
        context['date'] = datetime.date.today()

        context['chart'] = plot_leads_by_owner()
        context['pdf_link'] = True

        return context


class SalesActivitiesReport(ContextMixin,ConfigMixin,TemplateView):
    template_name = os.path.join('invoicing', 'crm', 'reports', 'activities', 'report.html')

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
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

        context['chart'] = plot_activities()
        context['pdf_link'] = True

        return context