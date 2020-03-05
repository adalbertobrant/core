from django.test import Client, TestCase
#from invoicing.tests.model_util import InvoicingModelCreator


class ReportViewTests(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.client = Client()

    @classmethod
    def setUpTestData(cls):
        # InvoicingModelCreator(cls).create_all()
        pass
