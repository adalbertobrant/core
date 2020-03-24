import datetime
import json
import os

from django.test import Client, TestCase
from django.test.client import RequestFactory
from django.urls import reverse

from django.contrib.auth.models import User
from accounting.models import Currency
from common_data.tests import create_test_user
from employees.models import Employee
from invoicing.models import *
from .model_util import InvoicingModelCreator
import accounting
from invoicing.views import (CustomerStatementPDFView,
                             SalesReportPDFView,
                             CustomerPaymentsPDFView,
                             SalesByCustomerReportPDFView,
                             AverageDaysToPayPDFView,
                             AccountsReceivableReportPDFView,
                             InvoiceAgingPDFView)
from common_data.tests import create_test_common_entities
from inventory.tests.model_util import InventoryModelCreator

import copy
from messaging.models import UserProfile
from employees.models import Employee
TODAY = datetime.datetime.today()


class CommonViewsTests(TestCase):
    fixtures = ['common.json', 'accounts.json', 'employees.json',  'inventory.json',
                'invoicing.json']

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        create_test_user(cls)
        create_test_common_entities(cls)
        cls.client = Client()

    def setUp(self):
        # wont work in setUpClass
        self.client.login(username='Testuser', password='123')

    def test_get_home_page(self):
        resp = self.client.get(reverse('invoicing:home'))
        self.assertEqual(resp.status_code, 302)
        # after configuration
        settings = SalesConfig.objects.first()
        settings.is_configured = True
        settings.save()
        resp = self.client.get(reverse('invoicing:home'))
        self.assertEqual(resp.status_code, 200)
        settings.is_configured = False
        settings.save()

    def test_get_config_page(self):
        resp = self.client.get(reverse('invoicing:config', kwargs={
            'pk': 1
        }))
        self.assertEqual(resp.status_code, 200)

    def test_post_config_page(self):
        Currency.objects.create(name="test", symbol="t")
        resp = self.client.post(reverse('invoicing:config',
                                        kwargs={'pk': 1}),
                                data={
            "default_invoice_comments": "Test Comments",
            "document_theme": 1,
            "logo": "img.jpg",
            "business_name": 'test name',
            "next_invoice_number": 1,
            "next_quotation_number": 1,
            "currency": 1,
            "default_warehouse": 1

        })
        self.assertEqual(resp.status_code, 302)

    def test_get_API_config_data(self):
        resp = self.client.get(reverse('invoicing:api-config', kwargs={
            'pk': 1
        }))
        self.assertIsInstance(json.loads(resp.content), dict)


class ReportViewsTests(TestCase):
    fixtures = ['common.json', 'accounts.json', 'employees.json',  'inventory.json',
                'invoicing.json']

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        create_test_user(cls)
        cls.client = Client()

    @classmethod
    def setUpTestData(cls):
        imc = InvoicingModelCreator(cls)
        imc.create_all()
        create_test_common_entities(cls)

    def setUp(self):
        # wont work in setUpClass
        self.client.login(username='Testuser', password='123')

    def test_get_customer_statement_form_page(self):
        resp = self.client.get(reverse('invoicing:customer-statement-form'))
        self.assertEqual(resp.status_code, 200)

    def test_get_customer_statement_page(self):
        resp = self.client.get(reverse('invoicing:customer-statement'), data={
            'customer': 1,
            'default_periods': 0,
            'start_period': (TODAY - datetime.timedelta(days=30)).strftime(
                '%m/%d/%Y'),
            'end_period': TODAY.strftime('%m/%d/%Y'),
        })
        self.assertEqual(resp.status_code, 200)

    def test_customer_statement_pdf(self):
        kwargs = {
            'start': (datetime.date.today()
                      - datetime.timedelta(365)).strftime('%d %B %Y'),
            'end': datetime.date.today().strftime('%d %B %Y'),
            'customer': 1
        }
        req = RequestFactory().get(reverse('invoicing:customer-statement-pdf',
                                           kwargs=kwargs))
        resp = CustomerStatementPDFView.as_view()(req, **kwargs)
        self.assertEqual(resp.status_code, 200)

    def test_get_invoice_aging_report_page(self):
        resp = self.client.get(reverse('invoicing:invoice-aging'))
        self.assertEqual(resp.status_code, 200)

    def test_get_invoice_aging_report_pdf_page(self):
        req = RequestFactory().get(reverse('invoicing:invoice-aging-pdf'))
        resp = InvoiceAgingPDFView.as_view()(req)
        self.assertEqual(resp.status_code, 200)

    def test_get_accounts_receivable_page(self):
        resp = self.client.get(reverse('invoicing:accounts-receivable-report'))
        self.assertEqual(resp.status_code, 200)

    def test_get_accounts_receivable_report_pdf_page(self):
        req = RequestFactory().get(reverse(
            'invoicing:accounts-receivable-report-pdf'))
        resp = AccountsReceivableReportPDFView.as_view()(req)
        self.assertEqual(resp.status_code, 200)

    def test_get_average_days_to_pay(self):
        resp = self.client.get(reverse('invoicing:average-days-to-pay-report'))
        self.assertEqual(resp.status_code, 200)

    def test_get_average_days_to_pay_pdf_page(self):
        req = RequestFactory().get(reverse(
            'invoicing:average-days-to-pay-pdf'))
        resp = AverageDaysToPayPDFView.as_view()(req)
        self.assertEqual(resp.status_code, 200)

    def test_get_sales_report_form_page(self):
        resp = self.client.get(reverse('invoicing:sales-report-form'))
        self.assertEqual(resp.status_code, 200)

    def test_get_sales_report_page(self):
        resp = self.client.get(reverse('invoicing:sales-report'), data={
            'default_periods': 4,
        })
        self.assertEqual(resp.status_code, 200)

    def test_sales_report_pdf(self):
        kwargs = {
            'start': (datetime.date.today()
                      - datetime.timedelta(365)).strftime('%d %B %Y'),
            'end': datetime.date.today().strftime('%d %B %Y'),
        }
        req = RequestFactory().get(reverse('invoicing:sales-report-pdf',
                                           kwargs=kwargs))
        resp = SalesReportPDFView.as_view()(req, **kwargs)
        self.assertEqual(resp.status_code, 200)

    def test_sales_by_customer_form(self):
        resp = self.client.get(reverse('invoicing:sales-by-customer-form'))
        self.assertEqual(resp.status_code, 200)

    def test_sales_by_customer_report(self):
        resp = self.client.get(reverse(
            'invoicing:sales-by-customer-report'), data={
                'start_period': datetime.date.today() - datetime.timedelta(days=365),
                'end_period': datetime.date.today()
        })
        self.assertEqual(resp.status_code, 200)

    def test_sales_by_customer_pdf(self):
        kwargs = {
            'start': (datetime.date.today()
                      - datetime.timedelta(days=365)).strftime('%d %B %Y'),
            'end': datetime.date.today().strftime('%d %B %Y')
        }
        req = RequestFactory().get(reverse(
            'invoicing:sales-by-customer-pdf', kwargs=kwargs))
        resp = SalesByCustomerReportPDFView.as_view()(req, **kwargs)

        self.assertEqual(resp.status_code, 200)

    def test_customer_payments_form(self):
        resp = self.client.get(reverse('invoicing:customer-payments-form'))
        self.assertEqual(resp.status_code, 200)

    def test_customer_payments_report(self):
        resp = self.client.get(reverse(
            'invoicing:customer-payments-report'), data={
                'start_period': (datetime.date.today()
                                 - datetime.timedelta(days=365)),
                'end_period': datetime.date.today()
        })
        self.assertEqual(resp.status_code, 200)

    def test_customer_payments_pdf(self):
        kwargs = {
            'start': (datetime.date.today()
                      - datetime.timedelta(days=365)).strftime('%d %B %Y'),
            'end': datetime.date.today().strftime('%d %B %Y')
        }
        req = RequestFactory().get(reverse(
            'invoicing:customer-payments-pdf', kwargs=kwargs))
        resp = CustomerPaymentsPDFView.as_view()(req, **kwargs)

        self.assertEqual(resp.status_code, 200)


class CustomerViewsTests(TestCase):
    fixtures = ['common.json', 'accounts.json', 'employees.json',  'inventory.json',
                'invoicing.json']

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        create_test_user(cls)
        cls.client = Client()
        cls.CUSTOMER_DATA = {
            'name': 'Org',
            'billing_address': 'Test Address',
            'banking_details': 'Test Details',
            'customer_type': 'organization'
        }

    @classmethod
    def setUpTestData(cls):
        imc = InvoicingModelCreator(cls)
        imc.create_all()
        create_test_common_entities(cls)

    def setUp(self):
        # wont work in setUpClass
        self.client.login(username='Testuser', password='123')

    def test_get_customer_create_page(self):
        resp = self.client.get(reverse('invoicing:create-customer'))
        self.assertEqual(resp.status_code, 200)

    def test_post_customer_create_page_individual(self):
        new_data = copy.deepcopy(self.CUSTOMER_DATA)
        new_data.update({
            'name': 'cust omer',
                    'customer_type': 'individual'
        })
        resp = self.client.post(
            reverse('invoicing:create-customer'),
            data=new_data)
        self.assertEqual(resp.status_code, 302)

    def test_post_customer_create_page(self):
        resp = self.client.post(
            reverse('invoicing:create-customer'),
            data=self.CUSTOMER_DATA)
        self.assertEqual(resp.status_code, 302)

    def test_get_update_customer_page(self):
        resp = self.client.get(
            reverse('invoicing:update-customer',
                    kwargs={
                        'pk': 1
                    })
        )
        self.assertEqual(resp.status_code, 200)

    def test_post_update_customer_page(self):
        resp = self.client.post(
            reverse('invoicing:update-customer',
                    kwargs={
                        'pk': self.customer_org.pk
                    }), data=self.CUSTOMER_DATA,
        )
        self.assertEqual(resp.status_code, 302)

    def test_post_update_customer_ind_no_change_page(self):
        resp = self.client.post(
            reverse('invoicing:update-customer',
                    kwargs={
                        'pk': self.customer_ind.pk
                    }), data={
            'name': 'Org man',
            'billing_address': 'Test Address',
            'banking_details': 'Test Details',
            'customer_type': 'individual'
        })
        self.assertEqual(resp.status_code, 302)

    def test_post_customer_update_page_switch_to_org(self):
        resp = self.client.post(
            reverse('invoicing:update-customer',
                    kwargs={
                        'pk': self.customer_ind.pk
                    }), data=self.CUSTOMER_DATA,
        )
        self.assertEqual(resp.status_code, 302)

        # create ind customer again
        InvoicingModelCreator(self).create_customer_ind()

    def test_post_customer_update_page_switch_to_ind(self):
        new_data = copy.deepcopy(self.CUSTOMER_DATA)
        new_data.update({
            'name': 'cust omer',
                    'customer_type': 'individual'
        })
        resp = self.client.post(
            reverse('invoicing:update-customer',
                    kwargs={
                        'pk': self.customer_org.pk
                    }), data=new_data,
        )
        self.assertEqual(resp.status_code, 302)
        # revert
        InvoicingModelCreator(self).create_customer_org()

    def test_get_delete_customer_page(self):
        resp = self.client.get(reverse('invoicing:delete-customer',
                                       kwargs={
                                           'pk': 1
                                       }))
        self.assertEqual(resp.status_code, 200)

    def test_post_customer_delete_page(self):
        cus = Customer.objects.create(
            organization=self.organization,
            billing_address="Test address",
            banking_details="test details"
        )
        resp = self.client.post(reverse('invoicing:delete-customer',
                                        kwargs={'pk': cus.pk}))
        self.assertEqual(resp.status_code, 302)

    def test_get_customer_list_page(self):
        resp = self.client.get(reverse('invoicing:customers-list'))
        self.assertEqual(resp.status_code, 200)

    def test_get_customer_detail_page(self):
        resp = self.client.get(reverse('invoicing:customer-details', kwargs={
            'pk': 1
        }))
        self.assertEqual(resp.status_code, 200)

    def test_create_customer_note(self):
        resp = self.client.post(reverse('invoicing:create-customer-note',
            kwargs={'customer': 1}), data={
                'note': 'some note'
            })
        self.assertEqual(resp.status_code, 200)


    def test_create_customer_individual(self):
        resp = self.client.post(reverse('invoicing:customer-member-add',
            kwargs={'pk': 1}), data={
                'first_name': 'some',
                'last_name': 'name'
            })
        self.assertEqual(resp.status_code, 302)



class SalesRepViewsTests(TestCase):
    fixtures = ['common.json', 'accounts.json', 'employees.json',  'inventory.json',
                'invoicing.json']

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        imc = InvoicingModelCreator(cls)
        imc.create_all()
        cls.client = Client()
        cls.REP_DATA = {
            'employee': 1,
            'can_validate_invoices': True,
            'can_offer_discounts': True,
            'number': 1
        }

    @classmethod
    def setUpTestData(cls):
        create_test_user(cls)

        cls.employee = Employee.objects.create(
            first_name="Test",
            last_name="Employee",
            user=cls.user
        )

        cls.employee2 = Employee.objects.create(
            first_name="Test2",
            last_name="Employee2",
            user=User.objects.create_user(username='guy', password='234')
        )
        create_test_common_entities(cls)

    def setUp(self):
        # wont work in setUpClass
        self.client.login(username='Testuser', password='123')

    def test_get_create_sales_rep_page(self):
        resp = self.client.get(reverse('invoicing:create-sales-rep'))
        self.assertEqual(resp.status_code, 200)

    def test_post_create_sales_rep_page(self):
        resp = self.client.post(reverse('invoicing:create-sales-rep'),
                                data={
            'employee': self.employee2.pk,
            'can_validate_invoices': True,
            'can_offer_discounts': True,
            'number': 5
        })
        self.assertEqual(resp.status_code, 302)

    def test_get_update_sales_rep_page(self):
        resp = self.client.get(
            reverse('invoicing:update-sales-rep', kwargs={'pk': 1}))
        self.assertEqual(resp.status_code, 200)

    def test_post_update_sales_rep_page(self):
        resp = self.client.post(
            reverse('invoicing:update-sales-rep', kwargs={'pk': 1}), data=self.REP_DATA)

        self.assertEqual(resp.status_code, 302)

    def test_get_delete_sales_rep_page(self):
        resp = self.client.get(
            reverse('invoicing:delete-sales-rep', kwargs={'pk': 1}))
        self.assertEqual(resp.status_code, 200)

    def test_post_delete_sales_rep_page(self):

        resp = self.client.post(reverse(
            'invoicing:delete-sales-rep', kwargs={'pk': SalesRepresentative.objects.first().pk}))

        self.assertEqual(resp.status_code, 302)
        InvoicingModelCreator(self).create_sales_representative()


class InvoiceViewTests(TestCase):
    fixtures = ['common.json', 'accounts.json', 'employees.json',  'inventory.json',
                'journals.json', 'invoicing.json']

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.client = Client()
        cls.DATA = {
            'status': 'invoice',
            'invoice_number': 10,
            'customer': cls.customer_org.pk,
            'salesperson': 1,
            'due': TODAY.strftime('%m/%d/%Y'),
            'date': TODAY.strftime('%m/%d/%Y'),
            'ship_from': 1,
            'terms': 'Test Terms',
            'comments': 'test comments',
            'item_list': json.dumps([
                {
                    'type': 'product',
                    'selected': '1 - item',
                    'quantity': 1,
                    'tax': '1 - Tax',
                    'unitPrice': '5.00',
                    'discount': '0'
                },
                {
                    'type': 'service',
                    'selected': '1 - item',
                    'hours': 1,
                    'fee': '200',
                    'tax': '1 - tax',
                    'discount': '0',
                    'rate': 50
                },
                {
                    'type': 'expense',
                    'selected': '1 - item',
                    'tax': '1 - tax',
                    'discount': '0'
                }
            ])
        }

    @classmethod
    def setUpTestData(cls):
        imc = InvoicingModelCreator(cls)
        imc.create_all()
        create_test_user(cls)
        cls.employee = Employee.objects.create(first_name='first',
                                               last_name='last',
                                               user=cls.user)
        amc = accounting.tests.model_util.AccountingModelCreator(
            cls).create_tax()
        create_test_common_entities(cls)
        UserProfile.objects.create(
            user=User.objects.get(username='Testuser'),
            email_address="test@address.com",
            email_password='123',
        )

    def setUp(self):
        # wont work in setUpClass
        self.client.login(username='Testuser', password='123')

    def test_get_create_invoice_page(self):
        resp = self.client.get(reverse('invoicing:create-invoice'))
        self.assertEqual(resp.status_code, 200)

    def test_post_create_invoice_page(self):
        resp = self.client.post(reverse('invoicing:create-invoice'),
                                data=self.DATA)
        self.assertEqual(resp.status_code, 302)

    def test_get_invoice_detail_page(self):
        resp = self.client.get(reverse('invoicing:invoice-detail',
                                       kwargs={'pk': 1}))
        self.assertEqual(resp.status_code, 200)

    def test_get_invoice_update_page(self):
        resp = self.client.get(reverse('invoicing:invoice-update',
                                       kwargs={'pk': 1}))
        self.assertEqual(resp.status_code, 200)

    def test_post_invoice_update_page(self):
        simple_data = dict(self.DATA)
        resp = self.client.post(reverse('invoicing:invoice-update',
                                        kwargs={'pk': 1}),
                                data=simple_data)

        self.assertEqual(resp.status_code, 302)

    def test_post_invoice_update_page_as_draft(self):
        simple_data = dict(self.DATA)
        inv = Invoice.objects.first()
        inv.draft = True
        inv.save()
        resp = self.client.post(reverse('invoicing:invoice-update',
                                        kwargs={'pk': 1}),
                                data=simple_data)

        self.assertEqual(resp.status_code, 302)

    def test_get_invoice_list_page(self):
        resp = self.client.get(reverse('invoicing:invoice-list'))
        self.assertEqual(resp.status_code, 200)

    def test_get_comnbined_invoice_payment_page(self):
        resp = self.client.get(reverse('invoicing:invoice-payment',
                                       kwargs={'pk': 1}))
        self.assertEqual(resp.status_code, 200)

    def test_post_invoice_payment_page(self):
        resp = self.client.post(reverse('invoicing:invoice-payment',
                                        kwargs={'pk': 1}), data={
            'invoice': 1,
            'amount': 10,
            'method': 'transfer',
            'sales_rep': 1,
            'comments': 'Test Comments',
            'date': TODAY.strftime('%m/%d/%Y')
        })
        self.assertEqual(resp.status_code, 302)

    def test_get_invoice_payment_detail_page(self):
        resp = self.client.get(reverse('invoicing:invoice-payment-detail',
                                       kwargs={'pk': self.payment.pk}))
        self.assertEqual(resp.status_code, 200)

    def test_invoice_pdf_page(self):
        # assume that the detail view can be converted to a pdf
        resp = self.client.get(reverse('invoicing:invoice-detail',
                                       kwargs={'pk': 1}))
        self.assertEqual(resp.status_code, 200)

    def test_get_invoice_email_page(self):
        with self.assertRaises(Exception):
            resp = self.client.get(reverse('invoicing:invoice-email',
                                           kwargs={'pk': 1}))

    def test_post_invoice_email_page(self):
        with self.assertRaises(Exception):
            self.client.post(reverse('invoicing:invoice-email',
                                     kwargs={'pk': 1}), data={
                'recipient': 'kandoroc@gmail.com',
                'subject': 'Test Subject',
                'content': 'TestContent'
            })

    def test_get_invoice_returns_page(self):
        resp = self.client.get(reverse('invoicing:invoice-returns',
                                       kwargs={'pk': 1}))
        self.assertEqual(resp.status_code, 200)

    def test_get_credit_note_create_page(self):
        resp = self.client.get(reverse('invoicing:credit-note-create',
                                       kwargs={'pk': 1}))
        self.assertEqual(resp.status_code, 200)

    def test_post_credit_note_create_page(self):
        resp = self.client.post(reverse('invoicing:credit-note-create',
                                        kwargs={'pk': 1}), data={
            'date': TODAY.strftime('%m/%d/%Y'),
            'invoice': 1,
            'comments': 'test comments',
            'returned-items': json.dumps([{
                'product': '1 - product',
                'returned_quantity': 1
            }])
        })

        self.assertEqual(resp.status_code, 302)

    def test_get_credit_note_detail_page(self):
        resp = self.client.get(reverse('invoicing:credit-note-detail',
                                       kwargs={'pk': 1}))
        self.assertEqual(resp.status_code, 200)

    def test_get_credit_note_list_page(self):
        resp = self.client.get(reverse('invoicing:credit-note-list'))
        self.assertEqual(resp.status_code, 200)

    def test_verify_invoice(self):
        resp = self.client.post('/invoicing/invoice/verify/' +
                                str(self.invoice.pk),
                                data={
                                    'user': '1',
                                    'password': '123'
                                })
        self.assertEqual(resp.status_code, 302)

    def test_verify_quotation(self):
        from django.contrib.auth.models import User
        resp = self.client.post('/invoicing/invoice/verify/' +
                                str(self.quotation.pk),
                                data={
                                    'user': User.objects.first().pk,
                                    'password': '123'
                                })
        self.assertEqual(resp.status_code, 302)

    def test_get_sales_invoice_expense_page(self):
        resp = self.client.get("/invoicing/invoice/shipping-costs/1")
        self.assertEqual(resp.status_code, 200)

    def test_post_sales_invoice_expense_page(self):
        resp = self.client.post("/invoicing/invoice/shipping-costs/1", data={
            'amount': 10,
            'description': 'description',
            'recorded_by': 1,
            'date': datetime.date.today(),
            'reference': 'ref'
        })
        self.assertEqual(resp.status_code, 302)

    def test_get_shipping_expense_list(self):
        resp = self.client.get('/invoicing/invoice/shipping-costs/list/1')
        self.assertEqual(resp.status_code, 200)

    def test_get_import_invoice_view(self):
        resp=self.client.get(reverse('invoicing:import-invoice-from-excel'))
        self.assertEqual(resp.status_code, 200)

    def test_post_import_invoice_view(self):
        with open(
                os.path.join('invoicing', 
                             'tests', 'invoice.xlsx'), 'rb') as f:
            resp=self.client.post(reverse(
                'invoicing:import-invoice-from-excel'), data={
                'sheet_name': 'Sheet1',
                'file': f,
                'date': datetime.date.today(),
                'due': datetime.date.today(),
                'customer': 1,
                'salesperson': 1,
                'sales_tax': 1,
                'invoice_number': 1000,
                'description': 1,
                'unit': 2,
                'quantity': 3,
                'unit_price': 4,
                'subtotal': 5,
                'start_row': 9,
                'end_row': 16
            })
        
        self.assertEqual(resp.status_code, 302)


class QuotationViewTests(TestCase):
    fixtures = ['common.json', 'accounts.json', 'employees.json',  'inventory.json',
                'journals.json', 'invoicing.json']

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.client = Client()
        cls.DATA = {
            'status': 'quotation',
            'customer': cls.customer_org.pk,
            'salesperson': 1,
            'quotation_valid': TODAY.strftime('%m/%d/%Y'),
            'quotation_date': TODAY.strftime('%m/%d/%Y'),
            'ship_from': 1,
            'terms': 'Test Terms',
            'comments': 'test comments',
            'item_list': json.dumps([
                {
                    'type': 'product',
                    'selected': '1 - item',
                    'unitPrice': '5.00',
                    'quantity': 1,
                    'tax': '1 - Tax',
                    'discount': '0'
                },
                {
                    'type': 'service',
                    'selected': '1 - item',
                    'hours': 1,
                    'tax': '1 - tax',
                    'discount': '0',
                    'fee': 200,
                    'rate': 20.00
                },
                {
                    'type': 'expense',
                    'selected': '1 - item',
                    'tax': '1 - tax',
                    'discount': '0'
                }
            ])
        }

    @classmethod
    def setUpTestData(cls):
        imc = InvoicingModelCreator(cls)
        imc.create_all()
        create_test_user(cls)
        amc = accounting.tests.model_util.AccountingModelCreator(
            cls).create_tax()
        create_test_common_entities(cls)

    def setUp(self):
        self.client.login(username='Testuser', password='123')

    def test_get_quotation_create_view(self):
        resp = self.client.get(reverse('invoicing:create-quotation'))

        self.assertEqual(resp.status_code, 200)

    def test_get_quotation_create_view_with_customer(self):
        resp = self.client.get(reverse('invoicing:create-quotation', kwargs={
            'customer': 1
        }))
        self.assertEqual(resp.status_code, 200)

    def test_post_quotation_create_view(self):
        resp = self.client.post(reverse('invoicing:create-quotation'),
                                data=self.DATA)

        self.assertEqual(resp.status_code, 302)

    def test_get_quotation_update_view(self):
        resp = self.client.get(reverse('invoicing:quotation-update', kwargs={
            'pk': self.quotation.pk
        }))
        self.assertEqual(resp.status_code, 200)

    def test_post_quotation_update_view(self):
        self.quotation.draft = True
        self.quotation.save()
        resp = self.client.post(reverse('invoicing:quotation-update', kwargs={
            'pk': self.quotation.pk
        }), data=self.DATA)
        self.assertEqual(resp.status_code, 302)

    def test_get_quotation_detail_view(self):
        resp = self.client.get(reverse('invoicing:quotation-details', kwargs={
            'pk': 1
        }))
        self.assertEqual(resp.status_code, 200)

    def test_make_invoice_from_quotation(self):
        resp = self.client.get(reverse('invoicing:make-invoice', kwargs={
            'pk': self.quotation.pk
        }))
        self.assertEqual(resp.status_code, 302)
        self.assertEqual(Invoice.objects.get(
            pk=self.quotation.pk).status,     "invoice")

        self.quotation.status = "quotation"
        self.quotation.save()

    def test_make_proforma_from_quotation(self):
        resp = self.client.get(reverse('invoicing:make-proforma', kwargs={
            'pk': self.quotation.pk
        }))
        self.assertEqual(resp.status_code, 302)
        self.assertEqual(Invoice.objects.get(
            pk=self.quotation.pk).status,    "proforma")

        self.quotation.status = "quotation"
        self.quotation.save()


class ConfigWizardTests(TestCase):
    fixtures = ['common.json', 'inventory.json',
                'invoicing.json', 'accounts.json', 'journals.json']

    @classmethod
    def setUpClass(cls):
        super().setUpClass()

        cls.client = Client()

    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_superuser(
            username="Testuser", email="admin@test.com", password="123")

    def setUp(self):
        self.client.login(username='Testuser', password='123')

    def test_config_wizard(self):
        config_data = {
            'config_wizard-current_step': 0,
            '0-next_invoice_number': 10,
            '0-next_quotation_number': 10,
            '0-default_warehouse': 1
        }

        customer_data = {
            'config_wizard-current_step': 1,
            '1-customer_type': 'individual',
            '1-name': 'some one'
        }

        employee_data = {
            '2-first_name': 'first',
            '2-last_name': 'last',
            '2-leave_days': 1,
            '2-pin': 1000,
            'config_wizard-current_step': 2,
        }

        rep_data = {
            'config_wizard-current_step': 3,
            '3-employee': 1
        }

        data_list = [config_data, customer_data, employee_data, rep_data]

        for step, data in enumerate(data_list, 1):

            try:
                resp = self.client.post(reverse('invoicing:config-wizard'),
                                        data=data)

                if step == len(data_list):
                    self.assertEqual(resp.status_code, 302)
                else:
                    self.assertEqual(resp.status_code, 200)
                    if resp.context.get('form'):

                        if hasattr(resp.context['form'], 'errors'):
                            print(resp.context['form'].errors)
            except ValueError:
                pass


class CRMViewTests(TestCase):
    fixtures = ['common.json', 'accounts.json', 'journals.json',
                'employees.json', 'inventory.json', 'invoicing.json', 'settings.json']

    @classmethod
    def setUpClass(cls):
        super().setUpClass()

        cls.client = Client()

    @classmethod
    def setUpTestData(cls):
        invmc = InventoryModelCreator(cls)
        invmc.create_warehouse_item()
        invmc.create_orderitem()
        create_test_user(cls)
        cls.imc = InvoicingModelCreator(cls)
        cls.imc.create_all()
        accounting.tests.model_util.AccountingModelCreator(cls).create_tax()
        create_test_common_entities(cls)
        cls.ls = LeadSource.objects.create(
            name='email',
            description='source'
        )
        cls.interaction_type = InteractionType.objects.create(
            name='type',
            description='of interaction'
        )

        cls.sales_team = SalesTeam.objects.create(
            name='team',
            description='focused on sales',
            leader=cls.sales_representative,
        )
        cls.lead = Lead.objects.create(
            title='title',
            description='description',
            owner=cls.sales_representative,
            team=cls.sales_team,
            created=datetime.date.today(),
            source=cls.ls,
        )
        cls.interaction = Interaction.objects.create(
            lead=cls.lead,
            contact=cls.individual,
            sales_representative=cls.sales_representative,
            type=cls.interaction_type
        )
        cls.task = Task.objects.create(
            title='do something',
            description='description',
            due=datetime.date.today(),
            lead=cls.lead,
            assigned=cls.sales_representative
        )

    def setUp(self):
        self.client.login(username='Testuser', password='123')

    def test_get_crm_dashboard(self):
        resp = self.client.get(reverse('invoicing:crm-dashboard'))
        self.assertEqual(resp.status_code, 200)

    def test_get_crm_async_dashboard(self):
        resp = self.client.get(reverse('invoicing:crm-async-dashboard'))
        self.assertEqual(resp.status_code, 200)

    def test_get_create_contact(self):
        resp = self.client.get(reverse('invoicing:create-contact',
            kwargs={'lead': 1}))
        self.assertEqual(resp.status_code, 200)

    def test_post_create_contact(self):
        resp = self.client.post(reverse('invoicing:create-contact',
            kwargs={'lead': 1}), data={
                'first_name': 'first',
                'last_name': 'last'
            })
        
        self.assertEqual(resp.status_code, 302)

    def test_get_create_lead(self):
        resp = self.client.get(reverse('invoicing:create-lead'))
        self.assertEqual(resp.status_code, 200)

    def test_post_create_lead(self):
        resp = self.client.post(reverse('invoicing:create-lead'),
            data={
                'title': 'title',
                'owner': 1,
                'contacts': [1],
                'source': 1,
                'opportunity': 1000,
                'probability_of_sale': 50,
                'status': 'new'
                })
        
        self.assertEqual(resp.status_code, 302)

    def test_get_update_lead(self):
        resp = self.client.get(reverse('invoicing:update-lead',
            kwargs={'pk': 1}))
        self.assertEqual(resp.status_code, 200)

    def test_post_update_lead(self):
        resp = self.client.post(reverse('invoicing:update-lead',
            kwargs={'pk': 1}), data={
                'title': 'title',
                'owner': 1,
                'contacts': [1],
                'opportunity': 1000,
                'probability_of_sale': 50,
                'status': 'new',
                'source': 1
                })
        self.assertEqual(resp.status_code, 302)

    def test_get_list_leads(self):
        resp = self.client.get(reverse('invoicing:list-leads'))
        self.assertEqual(resp.status_code, 200)

    def test_get_lead_detail(self):
        resp = self.client.get(reverse('invoicing:lead-details',
            kwargs={'pk':1}))
        self.assertEqual(resp.status_code, 200)

    def test_get_create_task(self):
        resp = self.client.get(reverse('invoicing:create-task'))
        self.assertEqual(resp.status_code, 200)

    def test_post_create_task(self):
        resp = self.client.post(reverse('invoicing:create-task'),
            data={
                'title': 'title',
                'description': 'desc',
                'due': datetime.date.today(),
                'lead': 1,
                'status': 'planned',
                'assigned': 1
            })
        
        self.assertEqual(resp.status_code, 302)

    def test_get_create_lead_task(self):
        resp = self.client.get(reverse('invoicing:create-lead-task',
            kwargs={'pk':1}))
        self.assertEqual(resp.status_code, 200)

    def test_post_create_lead_task(self):
        resp = self.client.post(reverse('invoicing:create-lead-task', kwargs={'pk':1}),
            data={
                'title': 'title',
                'description': 'desc',
                'due': datetime.date.today(),
                'lead': 1,
                'status': 'planned',
                'assigned': 1
            })
        
        self.assertEqual(resp.status_code, 302)

    def test_get_update_task(self):
        resp = self.client.get(reverse('invoicing:update-task',
            kwargs={'pk':1}))
        self.assertEqual(resp.status_code, 200)

    def test_post_update_task(self):
        resp = self.client.post(reverse('invoicing:update-task',
            kwargs={'pk':1}), data={
                'title': 'title',
                'description': 'desc',
                'due': datetime.date.today(),
                'lead': 1,
                'status': 'planned',
                'assigned': 1
            })
        self.assertEqual(resp.status_code, 302)

    def test_get_list_tasks(self):
        resp = self.client.get(reverse('invoicing:list-tasks'))
        self.assertEqual(resp.status_code, 200)

    def test_get_task_detail(self):
        resp = self.client.get(reverse('invoicing:task-detail',
            kwargs={'pk':1}))
        self.assertEqual(resp.status_code, 200)

    #task complete link

    def test_get_create_sales_team(self):
        resp = self.client.get(reverse('invoicing:create-sales-team'))
        self.assertEqual(resp.status_code, 200)

    def test_post_create_sales_team(self):
        resp = self.client.post(reverse('invoicing:create-sales-team'),
            data={
                'name': 'team',
                'description': 'for sales',
                'leader': 1,
                'members': [1]
            })
        self.assertEqual(resp.status_code, 302)

    def test_get_update_sales_team(self):
        resp = self.client.get(reverse('invoicing:update-sales-team',
            kwargs={'pk': 1}))
        self.assertEqual(resp.status_code, 200)

    def test_post_update_sales_team(self):
        resp = self.client.post(reverse('invoicing:update-sales-team',
            kwargs={'pk': 1}), data={
                'name': 'team',
                'description': 'for sales',
                'leader': 1,
                'members': [1]
            })
        self.assertEqual(resp.status_code, 302)

    def test_list_sales_team(self):
        resp = self.client.get(reverse('invoicing:list-sales-teams'))
        self.assertEqual(resp.status_code, 200)

    #sales team detail

    def test_get_create_lead_source(self):
        resp = self.client.get(reverse('invoicing:create-lead-source'))
        self.assertEqual(resp.status_code, 200)

    def test_post_create_lead_source(self):
        resp = self.client.post(reverse('invoicing:create-lead-source'), 
            data={
                'name': 'name',
                'description': 'some description'
            })
        self.assertEqual(resp.status_code, 302)

    def test_get_update_lead_source(self):
        resp = self.client.get(reverse('invoicing:update-lead-source',
            kwargs={'pk': 1}))
        self.assertEqual(resp.status_code, 200)

    def test_post_update_lead_source(self):
        resp = self.client.post(reverse('invoicing:update-lead-source',
            kwargs={'pk': 1}), data={
                'name': 'name',
                'description': 'some description'
            })
        self.assertEqual(resp.status_code, 302)

    def test_get_lead_source_list(self):
        resp = self.client.get(reverse('invoicing:list-lead-sources'))
        self.assertEqual(resp.status_code, 200)

    def test_get_create_interaction_type(self):
        resp = self.client.get(reverse('invoicing:create-interaction-type'))
        self.assertEqual(resp.status_code, 200)

    def test_post_create_interaction_type(self):
        resp = self.client.post(reverse('invoicing:create-interaction-type'),
            data={
                'name': 'name',
                'description': 'some description'
            })
        self.assertEqual(resp.status_code, 302)

    def test_update_interaction_type_get(self):
        resp = self.client.get(reverse('invoicing:update-interaction-type',
            kwargs={'pk': 1}))
        self.assertEqual(resp.status_code, 200)

    def test_post_interaction_type(self):
        resp = self.client.post(reverse('invoicing:update-interaction-type',
            kwargs={'pk': 1}), data={
                'name': 'name',
                'description': 'some description'
            })
        self.assertEqual(resp.status_code, 302)

    def test_get_interaction_type_list(self):
        resp = self.client.get(reverse('invoicing:list-interaction-types'))
        self.assertEqual(resp.status_code, 200)

    def test_get_contact_list(self):
        resp = self.client.get(reverse('invoicing:list-contacts'))
        self.assertEqual(resp.status_code, 200)

    def test_get_create_interaction(self):
        resp = self.client.get(reverse('invoicing:create-interaction',
            kwargs={'pk': 1}))
        self.assertEqual(resp.status_code, 200)

    def test_post_create_interaction(self):
        resp = self.client.post(reverse('invoicing:create-interaction',
            kwargs={'pk': 1}), data={
                'contact': 1,
                'sales_representative': 1,
                'type': 1,
                'description': 'something said',
                'lead': 1
            })
        
        self.assertEqual(resp.status_code, 302)

    def test_get_update_interaction(self):
        resp = self.client.get(reverse('invoicing:update-interaction',
            kwargs={'pk': 1}))
        self.assertEqual(resp.status_code, 200)

    def test_post_update_interaction(self):
        resp = self.client.post(reverse('invoicing:update-interaction',
            kwargs={'pk': 1}), data={
                'contact': 1,
                'sales_representative': 1,
                'type': 1,
                'description': 'something said',
                'lead': 1
            })
        
        self.assertEqual(resp.status_code, 302)

    def test_get_interaction_detail(self):
        resp = self.client.get(reverse('invoicing:interaction-detail',
            kwargs={'pk': 1}))
        self.assertEqual(resp.status_code, 200)

    def test_get_list_interactions(self):
        resp = self.client.get(reverse('invoicing:list-interactions'))
        self.assertEqual(resp.status_code, 200)


class POSViewTests(TestCase):
    fixtures = ['common.json', 'accounts.json', 'journals.json',
                'employees.json', 'inventory.json', 'invoicing.json', 'settings.json']

    @classmethod
    def setUpClass(cls):
        super().setUpClass()

        cls.client = Client()

    def setUp(self):
        self.client.login(username='Testuser', password='123')

    @classmethod
    def setUpTestData(cls):
        invmc = InventoryModelCreator(cls)
        invmc.create_warehouse_item()
        invmc.create_orderitem()
        create_test_user(cls)
        cls.imc = InvoicingModelCreator(cls)
        cls.imc.create_all()
        accounting.tests.model_util.AccountingModelCreator(cls).create_tax()
        create_test_common_entities(cls)
        cls.session = POSSession.objects.create(
            start = datetime.datetime.now(),
            sales_person = cls.employee
        )

    def test_pos_start_session(self):
        resp = self.client.post('/invoicing/pos/start-session/', content_type='application/json',
         data={
            'sales_person': '1 - employee',
            'timestamp': datetime.datetime.now().strftime('%Y-%m-%dT%H:%M:%S.123213')
        })

        self.assertEqual(resp.status_code, 200)
        self.assertTrue(json.loads(resp.content).get('id', None))

    def test_pos_end_session(self):
        resp = self.client.post('/invoicing/pos/end-session/', content_type='application/json', data={
            'id': self.session.pk,
            'timestamp': datetime.datetime.now().strftime('%Y-%m-%dT%H:%M:%S.123213')
        })

        self.assertEqual(resp.status_code, 200)
        self.assertEqual(json.loads(resp.content).get('status', None), 'OK')

    def test_pos_process_sale(self):
        resp = self.client.post('/invoicing/pos/process-sale/', content_type='application/json', data={
            'session': self.session.pk,
            'invoice': {
                'customer': '1 -customer',
                'sales_person': '1 - sales rep',
                'lines': [
                    {
                        'id': 1,#check product
                        'price': 100,
                        'quantity': 1,
                        'tax': {
                            'id': 1
                        }
                    }
                ]
            },
            'payments': [
                {
                    'tendered': 100,
                    'method': 'transfer'
                }
            ],
            'timestamp': datetime.datetime.now().strftime('%Y-%m-%dT%H:%M:%S.123213')
        })

        self.assertEqual(resp.status_code, 200)
        self.assertTrue(json.loads(resp.content).get('sale_id', None))
