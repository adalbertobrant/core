from django.test import TestCase, Client
from django.contrib.auth.models import User
import latrom
from common_data.models import GlobalConfig
from employees.models import Employee


class LicenseMiddlewareTest(TestCase):
    fixtures = ['common.json']

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.client = Client()

    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_superuser(
            'Testuser', 'admin@mail.com', '123')

    def setUp(self):
        self.client.login(username='Testuser', password='123')
        self.config = GlobalConfig.objects.first()

    # def test_license_check_with_no_license(self):
    #     shutil.move('license.json', '..')
    #     resp = self.client.get('/base/workflow')
    #     self.assertRedirects(resp, '/base/license-error-page')
    #     shutil.move('../license.json', '.')

    def test_no_debug_license_middleware_with_task_id(self):
        latrom.settings.DEBUG = False
        self.config.verification_task_id = "28374hur98fwhf9832"
        resp = self.client.get('/base/workflow')
        #self.assertEqual(resp.status_code, 200)
        latrom.settings.DEBUG = True


class UserMiddlewareTest(TestCase):
    fixtures = ['common.json']

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.client = Client()

    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_superuser(
            'Testuser', 'admin@mail.com', '123')

        cls.employee = Employee.objectst.create(
            first_name='second',
            last_name='Last',
            address='Model test address',
            email='test@mail.com',
            phone='1234535234',
            user=cls.user
        )

    def setUp(self):
        self.client.login(username='Testuser', password='123')
        self.config = GlobalConfig.objects.first()

    def test_exempted_urls(self):
        resp = self.client.get('/invoicing/')

    def test_calendar_urls(self):
        pass

    def test_employee_urls(self):
        pass

    def test_bookkeeper_urls(self):
        pass

    def test_inventory_urls(self):
        pass

    def test_sales_urls(self):
        pass

    def test_services_urls(self):
        pass
