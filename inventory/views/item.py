# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import os

from django.urls import reverse_lazy
from django.views.generic import DetailView, TemplateView
from django.views.generic.edit import (CreateView, DeleteView, FormView,
                                       UpdateView)
from django_filters.views import FilterView
from rest_framework.viewsets import ModelViewSet


from common_data.utilities import *
from common_data.views import PaginationMixin
from inventory import filters, models, serializers


class ItemSelectionPage(TemplateView):
    template_name = os.path.join('inventory', 'item', 'selection.html')


class InventoryItemAPIView(ModelViewSet):
    queryset = models.InventoryItem.objects.filter(active=True)
    serializer_class = serializers.InventoryItemSerializer


class InventoryItemDeleteView(DeleteView):
    template_name = os.path.join('common_data', 'delete_template.html')
    model = models.InventoryItem
    success_url = reverse_lazy('inventory:product-list')


class InventoryItemDetailView(DetailView):
    model = models.InventoryItem
    template_name = os.path.join("inventory", "item", "product", "detail.html")


class InventoryItemListView(ContextMixin, PaginationMixin, FilterView):
    paginate_by = 20
    filterset_class = filters.InventoryItemFilter
    template_name = os.path.join('inventory', 'item', "product", 'list.html')
    extra_context = {
        'title': 'InventoryItem List',
        "new_link": reverse_lazy("inventory:product-create")
    }

    def get_queryset(self):
        return models.InventoryItem.objects.filter(active=True).order_by('pk')
