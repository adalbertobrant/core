from accounting.models import Account, AccountingSettings
from invoicing.models import Customer 
from inventory.models import Supplier 

settings = AccountingSettings.objects.first()

for acc in Account.objects.filter(currency__isnull=True):
    acc.currency = settings.active_currency
    acc.save()

for cus in Customer.objects.filter(billing_currency__isnull=True):
    cus.billing_currency = settings.active_currency
    cus.save()

for sup in Supplier.objects.filter(billing_currency__isnull=True):
    sup.billing_currency = settings.active_currency
    sup.save()