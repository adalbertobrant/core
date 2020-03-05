from django.urls import re_path

from services import views

requisition_urls = [
    re_path(r'^equipment-requisition-create/?$',
            views.EquipmentRequisitionCreateView.as_view(),
            name='equipment-requisition-create'),
    re_path(r'^work-order-equipment-requisition-create/(?P<pk>\d+)/?$',
            views.WorkOrderEquipmentRequisitionCreateView.as_view(),
            name='work-order-equipment-requisition-create'),

    re_path(r'^work-order-consumable-requisition-create/(?P<pk>\d+)/?$',
            views.WorkOrderConsumableRequisitionCreateView.as_view(),
            name='work-order-consumable-requisition-create'),
    re_path(r'^consumable-requisition-create/?$',
            views.ConsumableRequisitionCreateView.as_view(),
            name="consumable-requisition-create"),

]
