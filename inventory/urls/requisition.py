from django.urls import re_path

from services import views

requisition_urls = [

    re_path(r'^equipment-requisition-list/?$',
            views.EquipmentRequisitionListView.as_view(),
            name='equipment-requisition-list'),
    re_path(r'^equipment-requisition-auth-view/(?P<pk>\d+)/?$',
            views.EquipmentRequisitionAuthorizeView.as_view(),
            name='equipment-requisition-auth-view'),
    re_path(r'^equipment-requisition-detail/(?P<pk>\d+)/?$',
            views.EquipmentRequisitionDetailView.as_view(),
            name='equipment-requisition-detail'),
    re_path(r'^equipment-requisition-release/(?P<pk>\d+)/?$',
            views.equipment_requisition_release,
            name='equipment-requisition-release'),
    re_path(r'^equipment-requisition-authorize/(?P<pk>\d+)/?$',
            views.equipment_requisition_authorize,
            name='equipment-requisition-authorize'),
    re_path(r'^consumable-requisition-list/?$',
            views.ConsumableRequisitionListView.as_view(),
            name='consumable-requisition-list'),
    re_path(r'^consumable-requisition-detail/(?P<pk>\d+)/?$',
            views.ConsumableRequisitionDetailView.as_view(),
            name='consumable-requisition-detail'),
    re_path(r'^consumable-requisition-release/(?P<pk>\d+)/?$',
            views.consumable_requisition_release,
            name='consumable-requisition-release'),
    re_path(r'^consumable-requisition-authorize/(?P<pk>\d+)/?$',
            views.consumable_requisition_authorize,
            name='consumable-requisition-authorize'),
    re_path(r'^consumable-requisition-auth-view/(?P<pk>\d+)/?$',
            views.ConsumableRequisitionAuthorizeView.as_view(),
            name='consumable-requisition-auth-view'),
    re_path(r'^equipment-return/(?P<pk>[\w]+)/?$',
            views.EquipmentReturnView.as_view(),
            name='equipment-return'),
]
