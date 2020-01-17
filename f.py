from invoicing.models import Invoice, InvoiceLine, ProductLineComponent
from inventory.models import InventoryItem


inv = Invoice.objects.first()
for i in InventoryItem.objects.filter(product_component__isnull=False):
    InvoiceLine.objects.create(
        product=ProductLineComponent.objects.create(
            product=i,
            unit_price=i.unit_purchase_price,
            quantity=1
        ),
        line_type=1
    )