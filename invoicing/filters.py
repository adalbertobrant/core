

import django_filters

from . import models


class CustomerFilter(django_filters.FilterSet):
    class Meta:
        model = models.Customer
        fields = {
            'organization__legal_name': ['icontains'],
            'individual__last_name': ['icontains'],

        }


class SalesRepFilter(django_filters.FilterSet):
    class Meta:
        model = models.SalesRepresentative
        fields = {
            'employee': ['exact'],
        }


class CreditNoteFilter(django_filters.FilterSet):
    class Meta:
        model = models.CreditNote
        fields = {
            'date': ['exact'],
        }


class InvoiceFilter(django_filters.FilterSet):
    class Meta:
        model = models.Invoice
        fields = {
            'date': ['exact'],
            'customer': ['exact'],
            'salesperson': ['exact'],
            'status': ['exact']
        }


class LeadFilter(django_filters.FilterSet):
    class Meta:
        model = models.Lead
        fields = {
            'title': ['icontains'],
            'status': ['exact'],
        }


class TaskFilter(django_filters.FilterSet):
    class Meta:
        model = models.Task
        fields = {
            'title': ['icontains'],
            'status': ['exact'],
            'assigned': ['exact'],
            'due': ['exact']
        }


class InteractionTypeFilters(django_filters.FilterSet):
    class Meta:
        model = models.InteractionType
        fields = {
            'name': ['icontains']
        }


class LeadSourcesFilters(django_filters.FilterSet):
    class Meta:
        model = models.LeadSource
        fields = {
            'name': ['icontains']
        }


class SalesTeamFilters(django_filters.FilterSet):
    class Meta:
        model = models.SalesTeam
        fields = {
            'name': ['icontains']
        }


class InteractionFilters(django_filters.FilterSet):
    class Meta:
        model = models.Interaction
        fields = {
            'contact': ['exact']
        }
