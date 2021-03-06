from django.urls import path, re_path

from common_data import views
from rest_framework import routers

individual_router = routers.DefaultRouter()
individual_router.register('api/individual', views.IndividualViewset)

organization_router = routers.DefaultRouter()
organization_router.register('api/organization', views.OrganizationViewset)


workflow = views.WorkFlowView.as_view()


urlpatterns = [
    re_path(r'^workflow/?$', workflow, name="workflow"),
    re_path(r'^config-wizard', views.ConfigWizard.as_view(),
            name='config-wizard'),
    re_path(r'^current-user-token/?', views.get_token_for_current_user,
            name='current-user-token'),
    re_path(r'^create-superuser/?$',
            views.CreateSuperUserView.as_view(), name='create-superuser'),
    re_path(r'^license-check/?$', views.LicenseCheck.as_view(),
            name='license-check'),
    re_path(r'^react-test/?$', views.ReactTestView.as_view(),
            name="react-test"),
    re_path(r'^about/?$', views.AboutView.as_view(), name="about"),
    re_path(r'^logo-url/?$', views.get_logo_url, name='logo-url'),
    re_path(r'^organization/create/?$', views.OrganizationCreateView.as_view(),
            name='organization-create'),
    re_path(r'^organization/list/?$', views.OrganizationListView.as_view(),
            name='organization-list'),
    re_path(r'^organization/update/(?P<pk>[\d]+)/?$', views.OrganizationUpdateView.as_view(),
            name='organization-update'),
    re_path(r'^organization/detail/(?P<pk>[\d]+)/?$', views.OrganizationDetailView.as_view(),
            name='organization-details'),
    re_path(r'^individual/create/?$', views.IndividualCreateView.as_view(),
            name='individual-create'),
    re_path(r'^individual/list/?$', views.IndividualListView.as_view(),
            name='individual-list'),
    re_path(r'^individual/update/(?P<pk>[\d]+)/?$', views.IndividualUpdateView.as_view(),
            name='individual-update'),
    re_path(r'^individual/detail/(?P<pk>[\d]+)/?$', views.IndividualDetailView.as_view(),
            name='individual-details'),
    re_path(r'^config/(?P<pk>[\d]+)/?$', views.GlobalConfigView.as_view(),
            name='config'),
#     re_path(r'^email/?$', views.SendEmail.as_view(),
#             name='email'),
    re_path(r'^authenticate/?$', views.AuthenticationView.as_view(),
            name='authenticate'),
    re_path(r'^api/current-user/?$', views.get_current_user,
            name='api-current-user'),
    re_path(r'^license-error-page/?$', views.LicenseErrorPage.as_view(),
            name='license-error-page'),
    re_path(r'^license-error/features/?$', views.LicenseFeaturesErrorPage.as_view(),
            name='license-error-features'),
    re_path(r'^license-error/users/?$', views.UsersErrorPage.as_view(),
            name='license-error-users'),
    re_path(r'^api/users/?$', views.UserAPIView.as_view(), name='api-users'),
    re_path(r'^api/users/(?P<pk>[\d]+)/?$',
            views.UserDetailAPIView.as_view(), name='api-users'),
    re_path(r'^create-note/?$', views.create_note, name='create-note'),
    
    re_path(r'^models/get-latest/(?P<model_name>[\w ]+)/?$',
            views.get_model_latest, name='get-latest-model'),
    re_path(r'^models/get-latest-group/?$',
            views.get_models_latest, name='get-latest-model-group'),
    path('api/notes/<str:document>/<int:id>', views.document_notes_api,
         name='notes-list'),
    path('blank-report/', views.ReportBlankView.as_view(),
         name='blank-report'),
    path('api/current-db/', views.current_db, name='api-current-db'),
    path('api/config/<int:pk>', views.ConfigAPIView.as_view()),
    path('api/bulk-individuals-create/', views.IndividualBulkCreateAPIView.as_view())
] + individual_router.urls + organization_router.urls
