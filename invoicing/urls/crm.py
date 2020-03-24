from invoicing.views.crm import *
from django.urls import path
from rest_framework import routers


lead_router = routers.DefaultRouter()
lead_router.register('api/lead', LeadAPIViewSet)

crm_urls = [
    path('crm-dashboard/', CRMDashboard.as_view(), name='crm-dashboard'),
    path('crm-async-dashboard/', CRMAsyncDashboard.as_view(),
         name='crm-async-dashboard'),
    path('create-contact/<int:lead>',
         CreateContact.as_view(), name='create-contact'),
    path('create-lead', LeadCreateView.as_view(), name='create-lead'),
    path('update-lead/<int:pk>', LeadUpdateView.as_view(), name='update-lead'),
    path('list-leads', LeadListView.as_view(), name='list-leads'),
    path('lead-detail/<int:pk>', LeadDetailView.as_view(), name='lead-detail'),
    path('create-task', TaskCreateView.as_view(), name='create-task'),
    path('create-task/<int:pk>', TaskCreateView.as_view(), name='create-lead-task'),
    path('update-task/<int:pk>', TaskUpdateView.as_view(), name='update-task'),
    path('list-tasks', TaskListView.as_view(), name='list-tasks'),
    path('task-detail/<int:pk>', TaskDetailView.as_view(), name='task-detail'),
    path('create-sales-team', SalesTeamCreateView.as_view(),
         name='create-sales-team'),
    path('update-sales-team/<int:pk>', SalesTeamUpdateView.as_view(),
         name='update-sales-team'),
    path('list-sales-teams', SalesTeamListView.as_view(),
         name='list-sales-teams'),
    path('create-lead-source', LeadSourceCreateView.as_view(),
         name='create-lead-source'),
    path('update-lead-source/<int:pk>', LeadSourceUpdateView.as_view(),
         name='update-lead-source'),
    path('list-lead-sources', LeadSourceListView.as_view(),
         name='list-lead-sources'),
    path('create-interaction-type', InteractionTypeCreateView.as_view(),
         name='create-interaction-type'),
    path('update-interaction-type/<int:pk>',
         InteractionTypeUpdateView.as_view(),
         name='update-interaction-type'),
    path('list-interaction-types', InteractionTypeListView.as_view(),
         name='list-interaction-types'),
    path('list-contacts', ContactListView.as_view(),
         name='list-contacts'),
    path('create-interaction/<int:pk>',
         InteractionCreateView.as_view(), name='create-interaction'),
    path('update-interaction/<int:pk>',
         InteractionUpdateView.as_view(), name='update-interaction'),
    path('list-interactions', InteractionListView.as_view(),
         name='list-interactions'),
    path('interaction-detail/<int:pk>',
         InteractionDetailView.as_view(), name='interaction-detail'),
] + lead_router.urls
