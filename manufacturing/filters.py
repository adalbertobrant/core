from django_filters.filterset import FilterSet
from manufacturing import models


class ProcessFilter(FilterSet):
    class Meta:
        model = models.Process
        fields = {
            'name': ['icontains']
        }


class ProcessProductFilter(FilterSet):
    class Meta:
        model = models.ProcessProduct
        fields = {
            'name': ['icontains'],
            'finished_goods': ['exact'],
            'type': ['exact']
        }


class ProductionOrderFilter(FilterSet):
    class Meta:
        model = models.ProductionOrder
        fields = {
            'date': ['exact'],
            'product': ['exact']
        }




class ProcessMachineFilter(FilterSet):
    class Meta:
        model = models.ProcessMachine
        fields = {
            'name': ['icontains']
        }


class MachineGroupFilter(FilterSet):
    class Meta:
        model = models.ProcessMachineGroup
        fields = {
            'name': ['icontains']
        }
