from inventory.models import InventoryItem
from invoicing.models import ProductLineComponent, Invoice, InvoiceLine
inv = Invoice.objects.first()
for i in InventoryItem.objects.all():
    InvoiceLine.objects.create(
        invoice=inv,
        product=ProductLineComponent.objects.create(
            quantity=1,
            product=i,
            unit_price=100,
        ),
        line_type=1
    )