# -*- coding: utf-8 -*-
from __future__ import unicode_literals


from django.db import models

from accounting.models import Account
from common_data.models import SoftDeletionModel
from inventory.models.item import InventoryItem
from inventory.models.item_management import StockReceipt
from inventory.models.order import Order
from common_data.models import QuickEntry

class Supplier(QuickEntry, SoftDeletionModel):
    '''The businesses and individuals that provide the organization with 
    products it will sell. Basic features include contact details address and 
    contact people.
    The account of the supplier is for instances when orders are made on credit.'''
    # one or the other
    quick_entry_fields = ['is_company', 'supplier_name']

    is_company = models.BooleanField(default=True)
    supplier_name = models.CharField(max_length=255, blank=True, null=True)
    organization = models.OneToOneField('common_data.Organization',
                                        on_delete=models.SET_NULL, blank=True,
                                        null=True)
    individual = models.OneToOneField('common_data.Individual',
                                      on_delete=models.SET_NULL, blank=True,
                                      null=True)
    account = models.ForeignKey('accounting.Account',
                                on_delete=models.SET_NULL,
                                blank=True, null=True)
    banking_details = models.TextField(blank=True, default="")
    billing_address = models.TextField(blank=True, default="")
    billing_currency = models.ForeignKey('accounting.currency', null=True,
        on_delete=models.SET_NULL)

    @property
    def name(self):
        if self.organization:
            return self.organization.legal_name
        else:
            return self.individual.full_name

    @property
    def phone(self):
        if self.organization:
            return self.organization.phone
        else:
            return self.individual.phone

    @property
    def is_organization(self):
        return self.organization != None

    @property
    def email(self):
        if self.is_organization:
            return self.organization.email
        else:
            return self.individual.email

    @property
    def address(self):
        if self.is_organization:
            return self.organization.business_address
        else:
            return self.individual.address

    @property
    def name(self):
        if self.is_organization:
            return str(self.organization)
        else:
            return str(self.individual)

    def __str__(self):
        return self.name

    @property
    def products(self):
        return InventoryItem.objects.filter(type=0, supplier=self)

    @property
    def consumables(self):
        return InventoryItem.objects.filter(type=2, supplier=self)

    @property
    def equipment(self):
        return InventoryItem.objects.filter(type=1, supplier=self)

    @property
    def last_delivery(self):
        qs = StockReceipt.objects.filter(order__supplier=self)
        if qs.exists():
            return qs.latest('pk')
        return None

    @property
    def average_days_to_deliver(self):
        qs = Order.objects.filter(supplier=self)
        total_days = 0
        fully_received = 0
        for order in qs:
            if order.fully_received and order.stockreceipt_set.count() > 0:
                # orders can have multiple stock receipts
                fully_received += 1

                last_receipt = order.stockreceipt_set.latest('receive_date')
                total_days += (last_receipt.receive_date - order.date).days

        if fully_received > 0:
            return total_days / fully_received

        return 0

    def create_account(self):
        if self.account is None:
            n_suppliers = Supplier.objects.all().count()
            # will overwrite if error occurs
            self.account = Account.objects.create(
                name="Vendor: %s" % self.name,
                id=2100 + n_suppliers + 1,  # the + 1 for the default supplier
                balance=0,
                type='liability',
                description='Account which represents debt owed to a Vendor',
                balance_sheet_category='current-liabilities',
                parent_account=Account.objects.get(pk=2000)  # trade payables
            )

    def save(self, *args, **kwargs):
        if not self.pk and self.supplier_name:
            if self.is_company and not self.organization:
                self.organization = Organization.objects.create(legal_name = self.supplier_name)
            
            if not self.is_company and not self.individual:
                names = self.supplier_name.split("")
                if len(names) < 2:
                    first = self.supplier_name
                    last = "Supplier"
                else:
                    first, last = names[:2]
                self.individual = Individual.objects.create(first_name=first,
                    last_name=last)
        if self.account is None:
            self.create_account()
        super().save(*args, **kwargs)