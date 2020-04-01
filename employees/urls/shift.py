from django.urls import path
from employees import views
from rest_framework.routers import DefaultRouter

shift_router = DefaultRouter()
shift_router.register('api/shift', views.ShiftAPIView)

schedule_router = DefaultRouter()
schedule_router.register('api/shift-schedule', views.ShiftScheduleAPIView)

shift_urls = [
    path('shift/create', views.ShiftCreateView.as_view(), name='create-shift'),
    path('get-current-shift/', views.get_current_shift_api, name='get-current-shift'),
    path('log-in-out/', views.timesheet_login, name='log-in-out'),
    path('api/log-in-out/<int:pk>/', views.api_timesheet_login, name='api-log-in-out'),
    path('shift/list', views.ShiftListView.as_view(), name='list-shift'),
    path('shift/detail/<int:pk>',
         views.ShiftDetailView.as_view(),
         name='detail-shift'),
    path('shift/update/<int:pk>',
         views.ShiftUpdateView.as_view(),
         name='update-shift'),
    path('shift-schedule/create/', views.ShiftScheduleCreateView.as_view(),
         name='create-shift-schedule'),
     path('shift-schedule/list/', views.ShiftScheduleListView.as_view(),
         name='list-shift-schedules'),
     path('shift-schedule/update/<int:pk>/', views.ShiftScheduleUpdateView.as_view(),
         name='update-shift-schedule'),
    path('shift-schedule/detail/<int:pk>',
         views.ShiftScheduleDetailView.as_view(),
         name='detail-shift-schedule'),
    

] + shift_router.urls + schedule_router.urls
