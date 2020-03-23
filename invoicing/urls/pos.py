from django.urls import path
from invoicing.views.pos import *

urls = [
    path('pos/start-session/', start_session),
    path('pos/end-session/', end_session),
    path('pos/process-sale/', process_sale),
]