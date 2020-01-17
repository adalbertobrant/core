from inventory.models import (InventoryItem, 
                            Supplier,
                             WareHouseItem,
                             StockAdjustment,
                             InventoryScrappingRecordLine,
                             StockReceiptLine)
import datetime
import pygal
from common_data.utilities.plotting import CustomStyle


def composition_plot():
    
    stock =  InventoryItem.objects.filter(type=0)
    chart = pygal.Pie(print_values=True, style=CustomStyle, height=300)
    ordered = [i for i in stock]
    ordered.sort(key=lambda x: x.quantity,reverse=True)
    for i in ordered[:10]:
        chart.add(i.name, i.quantity)

    return chart

def single_item_composition_plot(item):
    stock =  WareHouseItem.objects.filter(item=item)
    chart = pygal.Pie(print_values=True, style=CustomStyle,
        height=300)
    chart.title = 'Location Composition Chart'
    for i in stock:
        chart.add(str(i.warehouse), i.quantity)

    return chart

def inventory_track_plot(item):
    chart = pygal.Line(style=CustomStyle, height=300)
    chart.title= 'Product movement graph'
    evt_dates = set()
    # receipts
    for line in StockReceiptLine.objects.filter(line__item=item):
        evt_dates.add(line.receipt.receive_date) 
    # stock take
    for line in StockAdjustment.objects.filter(
            warehouse_item__item=item):
        evt_dates.add(line.inventory_check.date)
    # scrapping 
    for line in InventoryScrappingRecordLine.objects.filter(
            item=item):
        evt_dates.add(line.scrapping_record.date)
    ordered = list(evt_dates)
    ordered.sort()
    
    chart.x_labels = ordered 
    chart.add(str(item), [item.product_component.quantity_on_date(date) \
        for date in ordered])
    return chart

def average_delivery_plot():
    chart = pygal.HorizontalBar(style=CustomStyle, height=500)
    for sup in Supplier.objects.all():
        chart.add(str(sup), sup.average_days_to_deliver)

    return chart