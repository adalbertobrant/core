from django.views.generic import TemplateView
import os

class POSAppView(TemplateView):
    template_name = os.path.join('invoicing', 'pos.html')