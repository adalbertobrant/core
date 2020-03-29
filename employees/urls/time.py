from django.urls import re_path, path
from rest_framework import routers

from employees import views


timesheet_router = routers.DefaultRouter()
timesheet_router.register(r'^api/timesheet', views.TimeSheetViewset)

attendance_router = routers.DefaultRouter()
attendance_router.register(r'^api/attendance', views.AttendanceLineViewset)

timesheet_urls = [
    re_path(r'^timesheet/create/?$', views.CreateTimeSheetView.as_view(),
            name='timesheet-create'),
    re_path(r'^timesheet/list/?$', views.ListTimeSheetView.as_view(),
            name='timesheet-list'),
    re_path(r'^timesheet/update/(?P<pk>[\d]+)/?$',
            views.TimeSheetUpdateView.as_view(), name='timesheet-update'),
    re_path(r'^timesheet/detail/(?P<pk>[\d]+)/?$',
            views.TimeSheetDetailView.as_view(), name='timesheet-detail'),
    re_path(r'^time-logger/?$', views.TimeLoggerView.as_view(),
            name='time-logger'),
    

] + timesheet_router.urls + attendance_router.urls
