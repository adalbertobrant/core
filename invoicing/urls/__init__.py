from django.urls import re_path, path
from invoicing import views
from rest_framework.routers import DefaultRouter
from .report_urls import report_urls
from .invoice import urls as invoice_urls
from .pos import urls as pos_urls
from .crm import crm_urls

customer_router = DefaultRouter()
customer_router.register(
    r'api/customer', views.CustomerAPIViewSet, base_name='customer')



customer_urls = [
    re_path(r'^create-customer/?$',
            views.CustomerCreateView.as_view(),
            name='create-customer'),
    re_path(r'^create-customer-note/(?P<customer>[\d]+)/?$',
            views.create_customer_note,
            name='create-customer-note'),
    path('create-multiple-customers/',
         views.CreateMultipleCustomersView.as_view(),
         name='create-multiple-customers'),
    path('import-customers-from-excel/',
         views.ImportCustomersView.as_view(),
         name='import-customers-from-excel'),
    re_path(r'^update-customer/(?P<pk>[\w]+)/?$',
            views.CustomerUpdateView.as_view(),
            name='update-customer'),
    re_path(r'^customer-detail/(?P<pk>[\w]+)$',
            views.CustomerDetailView.as_view(),
            name='customer-details'),
    re_path(r'^delete-customer/(?P<pk>[\w]+)$',
            views.CustomerDeleteView.as_view(), name='delete-customer'),
    re_path(r'^customers-list/?$',
            views.CustomerListView.as_view(),
            name='customers-list'),
    re_path(r'^customer/add-member/(?P<pk>[\d]+)?$',
            views.AddCustomerIndividualView.as_view(),
            name='customer-member-add'),
    path('payment-method/create', views.CreatePaymentMethod.as_view() ,name='create-payment-method'),
    path('payment-method/list', views.PaymentMethodList.as_view() ,name='list-payment-methods'),
    path('payment-method/update/<int:pk>', views.UpdatePaymentMethod.as_view() ,name='update-payment-method'),
] + customer_router.urls

sales_rep_router = DefaultRouter()
sales_rep_router.register(
    r'api/sales-rep', views.SalesRepsAPIViewSet, base_name='sales-rep')

sales_rep_urls = [
    re_path(r'^create-sales-rep$', views.SalesRepCreateView.as_view(),
            name='create-sales-rep'),
    re_path(r'^update-sales-rep/(?P<pk>[\w]+)$',
            views.SalesRepUpdateView.as_view(), name='update-sales-rep'),
    re_path(r'^delete-sales-rep/(?P<pk>[\w]+)$',
            views.SalesRepDeleteView.as_view(), name='delete-sales-rep'),
    re_path(r'^sales-reps-list$', views.SalesRepListView.as_view(),
            name='sales-reps-list'),
    re_path(r'^api/payment-method/(?P<pk>[\w]+)/?$', views.PaymentMethodAPIView.as_view(), 
                name='api/payment-method')
] + sales_rep_router.urls

urlpatterns = [
    re_path(r'^$', views.Home.as_view(), name="home"),
    re_path(r'^async-dashboard/?$', views.AsyncDashboard.as_view(),
            name="async-dashboard"),
    re_path(r'^config/(?P<pk>[\d]+)/?$',
            views.ConfigView.as_view(), name="config"),
    re_path(r'^api/config/(?P<pk>[\d]+)/?$',
            views.ConfigAPIView.as_view(), name='api-config')
] + report_urls + customer_urls + sales_rep_urls + invoice_urls + pos_urls + crm_urls
