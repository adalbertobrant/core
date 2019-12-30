from inventory.models import InventoryItem, WareHouseItem
import datetime
import pygal
from pygal.style import DefaultStyle
from common_data.utilities.plotting import CustomStyle


def composition_plot():
    
    stock =  InventoryItem.objects.filter(type=0)
    chart = pygal.Pie(print_values=True, style=CustomStyle, height=300)
    for i in stock:
        chart.add(i.name, i.quantity)

    return chart

def single_item_composition_plot(item):
    stock =  WareHouseItem.objects.filter(item=item)
    chart = pygal.Pie(print_values=True, style=CustomStyle
    )
    for i in stock:
        chart.add(str(i.warehouse), i.quantity)

    return chart