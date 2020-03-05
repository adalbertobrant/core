from django.views.generic import (TemplateView, 
                                  CreateView, 
                                  UpdateView, 
                                  DetailView)
from invoicing import models, forms, filters
from common_data.views import PaginationMixin, IndividualCreateView
from common_data.utilities import ContextMixin
from django_filters.views import FilterView
from django.urls import reverse_lazy as reverse
from common_data.filters import IndividualFilter
from common_data.models import Individual
from planner.models import Event
from django.db.models import Q
import os
import datetime
import pygal
import calendar
from dateutil.relativedelta import relativedelta
from common_data.utilities.plotting import CustomStyle

CREATE = os.path.join('common_data', 'crispy_create_template.html')

class CRMDashboard(TemplateView):
    template_name = os.path.join('invoicing', 'crm', 'dashboard.html')


class CRMAsyncDashboard(TemplateView):
    template_name = os.path.join('invoicing', 'crm', 'async_dashboard.html')

    def sales_funnel_chart(self):
        '''Compare leads vs quotation vs invoice revenue projection'''
        today = datetime.date.today()
        lead_revenue = sum([i.opportunity * i.probability_of_sale / 100.0\
            for i in models.Lead.objects.filter(projected_closing__gte=today)])
        quotation_revenue = sum(i.subtotal for i in \
            models.Invoice.objects.filter(status='quotation'))
        invoice_revenue = sum(i.subtotal for i in \
            models.Invoice.objects.all().exclude(Q(Q(status='quotation') | Q(status='proforma'))))
        
        chart = pygal.HorizontalBar(style=CustomStyle, height=400)
        chart.add('Leads', lead_revenue)
        chart.add('Quotations', quotation_revenue)
        chart.add('Invoices', invoice_revenue)
        return chart

    def sales_forecast_chart(self):
        today = datetime.date.today()
        sales = []
        for i in range(6):
            day = today + relativedelta(months=i)
            first, last = calendar.monthrange(day.year, day.month)
            
            first_date = datetime.date(day.year, day.month, 1)
            last_date = datetime.date(day.year, day.month, last)
            leads = models.Lead.objects.filter(
                projected_closing__gte=first_date, 
                projected_closing__lte=last_date)
            sales.append(( day.strftime("%B '%y"),
                sum([i.opportunity * (i.probability_of_sale / 100.0) \
                    for i in leads])))

        chart = pygal.Line(style=CustomStyle, height=400,x_label_rotation=30, fill=True)
        chart.x_labels = [i[0] for i in sales]
        chart.add('Sales Projection', [i[1] for i in sales])

        return chart



    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['active_leads'] = \
            models.Lead.objects.all().exclude(status='cold').count()
        context['sales_mvp'] = ''
        max_leads = 0
        for rep in models.SalesRepresentative.objects.all():
            if rep.lead_set.all().count() > max_leads:
                context['sales_mvp'] = str(rep)
                max_leads = rep.lead_set.all().count()

        context['active_tasks'] = models.Task.objects.all().exclude(Q(Q(status='cancelled') | Q(status='completed'))).count()

        context['funnel_chart'] = \
            self.sales_funnel_chart().render(is_unicode=True)

        context['forecast_chart'] = \
            self.sales_forecast_chart().render(is_unicode=True)
        
        return context

class LeadCreateView(ContextMixin, CreateView):
    template_name = CREATE
    form_class = forms.LeadForm
    extra_context = {'title': 'Create Lead'}

    def form_valid(self, form):
        resp = super().form_valid(form)
        if form.cleaned_data['reminder']:
            Event.objects.create(
                date=form.cleaned_data['reminder'],
                description=self.object.description,
                label=self.object.title,
                owner=self.object.owner.employee
            )
        return resp



class LeadDetailView(DetailView):
    template_name = os.path.join('invoicing', 'crm', 'leads', 'detail.html')
    model = models.Lead

class LeadUpdateView(ContextMixin, UpdateView):
    template_name = CREATE
    form_class = forms.LeadForm
    model = models.Lead
    extra_context = {'title': 'Update Lead'}



class LeadListView(ContextMixin, PaginationMixin, FilterView):
    template_name = os.path.join('invoicing', 'crm', 'leads', 'list.html')
    filterset_class = filters.LeadFilter
    extra_context = {
        'title': 'Leads List',
        'new_link': reverse('invoicing:create-lead')
    }

    def  get_queryset(self):
        return models.Lead.objects.all()
    


class TaskCreateView(CreateView):
    template_name = CREATE
    form_class = forms.TaskForm
    extra_context = {'title': 'Create Task'}

    def get_initial(self):
        if self.kwargs.get('pk', None):
            return {
                'lead': self.kwargs['pk']
            }
        return {}

    def form_valid(self, form):
        resp = super().form_valid(form)
        evt = Event.objects.create(
            date=self.object.due,
            description=self.object.description,
            label=self.object.title,
            owner=self.object.assigned.employee
        )
        self.object.event = evt
        self.object.save()
        return resp

class TaskDetailView(DetailView):
    template_name = os.path.join('invoicing', 'crm', 'tasks', 'detail.html')
    model = models.Task


class TaskUpdateView(UpdateView):
    template_name = CREATE
    form_class = forms.TaskForm
    extra_context = {'title': 'Update Task'}
    model = models.Task

    def form_valid(self, form):
        resp = super().form_valid(form)
        if self.object.event.date != self.object.due:
            evt = Event.objects.create(
                date=self.object.due,
                description=self.object.description,
                label=self.object.title,
                owner=self.object.assigned.employee
            )
            self.object.event = evt
            self.object.save()
        return resp

class TaskListView(PaginationMixin, FilterView):
    template_name = os.path.join('invoicing', 'crm', 'tasks', 'list.html')
    filterset_class = filters.TaskFilter
    extra_context = {
        'title': 'My Tasks List',
        'new_link': reverse('invoicing:create-task')
    }

    def  get_queryset(self):
        return models.Task.objects.all()


class InteractionCreateView(CreateView):
    template_name = CREATE
    form_class = forms.InteractionForm
    extra_context = {'title': 'Record Interaction'}

    def get_initial(self):
        if self.kwargs.get('pk', None):
            return {
                'lead': self.kwargs['pk']
            }
        return {}


class InteractionUpdateView(UpdateView):
    template_name = CREATE
    form_class = forms.InteractionForm
    model = models.Interaction
    extra_context = {'title': 'Update Interaction Details'}


class InteractionDetailView(DetailView):
    template_name = os.path.join('invoicing', 'crm', 'interaction', 
        'detail.html')
    model = models.Interaction


class InteractionListView(FilterView):
    template_name = os.path.join('invoicing', 'crm', 'leads', 'list.html')
    filterset_class = filters.LeadFilter
    extra_context = {
        'title': 'Interaction List'
    }

    def  get_queryset(self):
        return models.Lead.objects.all()

class LeadSourceCreateView(CreateView):
    template_name = CREATE
    form_class = forms.LeadSourceForm
    extra_context = {'title': 'Create Lead Source'}


class LeadSourceUpdateView(UpdateView):
    template_name = CREATE
    form_class = forms.LeadSourceForm
    extra_context = {'title': 'Update Lead Source'}
    model = models.LeadSource


class LeadSourceListView(PaginationMixin, FilterView):
    filterset_class = filters.LeadSourcesFilters
    template_name = os.path.join('invoicing', 'crm', 'lead_source_list.html')
    extra_context = {
        'title': 'Lead Source List',
        'new_link': reverse('invoicing:create-lead-source')
    }

    def get_queryset(self):
        return models.LeadSource.objects.all()


class InteractionTypeCreateView(CreateView):
    template_name = CREATE
    form_class = forms.InteractionTypeForm
    extra_context = {'title': 'Create Interaction Type'}


class InteractionTypeUpdateView(UpdateView):
    template_name = CREATE
    form_class = forms.InteractionTypeForm
    extra_context = {'title': 'Update Interaction Type'}
    model = models.InteractionType


class InteractionTypeListView(PaginationMixin, FilterView):
    filterset_class = filters.InteractionTypeFilters
    template_name = os.path.join('invoicing', 'crm', 
        'interaction_type_list.html')
    extra_context = {
        'title': 'Interaction Types List',
        'new_link': reverse('invoicing:create-interaction-type')
    }

    def get_queryset(self):
        return models.InteractionType.objects.all()



class ContactListView(PaginationMixin, FilterView):
    template_name = os.path.join('invoicing', 'crm', 'contact_list.html')
    filterset_class = IndividualFilter
    extra_context = {
        'title': 'Contact List',
        'new_link': reverse('base:individual-create')
    }
    
    def get_queryset(self):
        return Individual.objects.filter(organization__isnull=False)
    


class SalesTeamCreateView(CreateView):
    template_name = CREATE
    form_class = forms.SalesTeamForm
    extra_context = {'title': 'Create Sales Team'}


class SalesTeamUpdateView(UpdateView):
    template_name = CREATE
    form_class = forms.SalesTeamForm
    extra_context = {'title': 'Update Sales Team'}
    model = models.SalesTeam


class SalesTeamListView( PaginationMixin ,FilterView):
    filterset_class = filters.SalesTeamFilters
    template_name = os.path.join('invoicing', 'crm', 'team_list.html')
    extra_context = {
        'title': 'Sales Teams List',
        'new_link': reverse('invoicing:create-sales-team')
    }

    def get_queryset(self):
        return models.SalesTeam.objects.all()


class CreateContact(IndividualCreateView):
    def form_valid(self, form):
        resp = super().form_valid(form)
        lead = models.Lead.objects.get(pk=self.kwargs['lead'])
        lead.contacts.add(self.object)
        lead.save()
        return resp

    def get_success_url(self):
        return reverse('invoicing:lead-detail', 
            kwargs={'pk': self.kwargs['lead']})