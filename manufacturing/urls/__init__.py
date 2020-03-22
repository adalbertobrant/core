from django.urls import path
from manufacturing import views
from manufacturing.urls.process import process_urls

urlpatterns = [
    path('', views.Dashboard.as_view(), name='dashboard'),
]
urlpatterns += process_urls
