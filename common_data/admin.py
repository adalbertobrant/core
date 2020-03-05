from django.contrib import admin

# Register your models here.
from common_data import models
admin.site.register(models.GlobalConfig)
admin.site.register(models.Individual)
admin.site.register(models.Organization)
admin.site.register(models.PhoneNumber)
