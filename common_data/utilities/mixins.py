import datetime
import json
import os

from django.urls import re_path
from django.http import HttpResponse
from django.views.generic import DetailView, ListView, View
from django.views.generic.edit import CreateView, DeleteView, UpdateView
from common_data import models
import messaging
import invoicing
from latrom import settings
from .functions import apply_style, PeriodSelectionException
import logging
import sys


log_file = "service.log"

logger = logging.getLogger('name')
logger.setLevel(logging.ERROR)

log_format = logging.Formatter("%(asctime)s [%(levelname)-5.5s ] %(message)s")

file_handler = logging.FileHandler(log_file)
file_handler.setLevel(logging.ERROR)
file_handler.setFormatter(log_format)
console_handler = logging.StreamHandler(sys.stdout)
console_handler.setFormatter(log_format)
logger.addHandler(console_handler)
logger.addHandler(file_handler)

class ConfigMixin(object):
    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        config = models.GlobalConfig.objects.first()
        context.update(config.__dict__)
        context.update({
            'logo': config.logo,
            'logo_width': config.logo_width,
            'business_name': config.business_name,
            'business_address': config.business_address
        })
        return apply_style(context)


class ContextMixin(object):
    extra_context = {}

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        context.update(self.extra_context)
        return context


class PeriodReportMixin(View):
    def get(self, request, *args, **kwargs):
        try:
            return super().get(request, *args, **kwargs)
        except PeriodSelectionException as e:
            return HttpResponse(f'<h3>{e}</h3>')


class ContactsMixin(object):
    '''Contacts mixin is a utility class used to extract email addresses and phone numbers from text fields in places where it is inconvenient to rename a foreign key'''
    email_fields = []
    phone_fields = []

    def save(self, *args, **kwargs):
        ret = super().save(*args, **kwargs)
        for field in self.email_fields:
            address = self.__getattribute__(field)
            if address and address != "":
                if not messaging.models.EmailAddress.objects.filter(
                        address=address).exists():
                    messaging.models.EmailAddress.objects.create(
                        address=address)

        for field in self.phone_fields:
            number = self.__getattribute__(field)
            if number and number != "":
                if not models.PhoneNumber.objects.filter(number=number).exists():
                    models.PhoneNumber.objects.create(number=number)

        return ret


class AutomatedServiceMixin(object):#not really a mixin
    service_name = None
    active_services = ['inventory', 'accounting', 'common']

    DEFAULT_CONFIG = {
                    'inventory': False,
                    'employees': False,
                    'accounting': False,
                    'common': False,
                    'messaging': False
                }
    '''
    Ensures the service is only run once per day. Especially for servers 
    that restart multiple times a day.
    Uses two features,
        1. On global config, stores the last service run date.
        2. In a json file, stores the the services run on that date.

    If there is no record of a service being run, create a record and execute the service.
    If a record exists but it is more than a day old, reset the config file and 
    execute the service
    if the record exists is less than a day old check the config file against the specific service, if run skip else run again
    '''
    def __init__(self):
        if not os.path.exists('service_config.json'):
            with open('service_config.json', 'w') as conf:
                json.dump(self.DEFAULT_CONFIG, conf)
        
        with open('service_config.json', 'r') as conf:
            self.config = json.load(conf)

    def reset_config(self):
        '''reset the config status every day'''
        config = models.GlobalConfig.objects.first()
        last_run = config.last_automated_service_run
        complete = all([self.config[i] for i in self.active_services])
        if complete and (last_run and (datetime.datetime.now() - \
                    last_run).total_seconds() > 86400):
            self.config = self.DEFAULT_CONFIG
            with open('service_config.json', 'w') as conf:
                json.dump(self.config, conf)

    def update_config(self):
        self.config[self.service_name] = True
        
        
        with open('service_config.json', 'w') as conf:
            json.dump(self.config, conf)
        
        #only update the last service run when all the services are run.
        if all([self.config[i] for i in self.active_services]):
            config = models.GlobalConfig.objects.first()
            config.last_automated_service_run = datetime.datetime.now()
            config.save()
        

    def _run(self):
        print(f'running service {self.service_name}...\n')
        try:
            super()._run()
        except:
            logger.exception(f'Error running service {self.service_name}')

    def run(self):
        self.reset_config()
        print(f'attempting to run service {self.service_name}')
        config = models.GlobalConfig.objects.first()
        print(config.last_automated_service_run)
        print((datetime.datetime.now() - \
                    config.last_automated_service_run).total_seconds() )
        print(self.config[self.service_name])
        if not config.last_automated_service_run or (
                (datetime.datetime.now() - \
                    config.last_automated_service_run).total_seconds() > 86400 \
                        and not self.config[self.service_name]):
            self._run()
            self.update_config()

