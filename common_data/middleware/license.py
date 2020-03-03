from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render
import json
import hashlib
import datetime
import requests
import hmac 
import time
import urllib
from common_data.models import GlobalConfig
from latrom import settings
import logging 
import os
logger =logging.getLogger(__name__)



class UserTrackerException(Exception):
    pass

class UserInfo(object):
    """
    Objec that represents the request information related to a particular
    user.
    Stores the db user object, the most recent request and the ip they are 
    requesting from.
    
    methods
    =======
    verify_user -> raises an exception if the user is requesting data from 
    the server from multiple computers
    """
    def __init__(self, user, source_ip):
        self.user = user
        self.last_request = time.time()
        self.source_ip = source_ip

    def verify_request(self, request):
        """
        No two requests from the same user must come from 
        two different IPs within less than 60 seconds
        """
        now = time.time()
        if now - self.last_request > 60:
            #update the IP
            self.source_ip = request.META['REMOTE_ADDR']
            self.last_request = now
        else:
            #< 60s
            #makes sure the request is the same IP
            if self.source_ip != request.META['REMOTE_ADDR']:
                logger.critical('The same user is using multiple machines')
                raise UserTrackerException(
                    "The same user is using multiple addresses")

            else:
                #update last request
                self.last_request = now

class UserTracker(object):
    def __init__(self):
        self.users = []
        self.users_info = []

        #assume 1 max user if no license is present
        if not os.path.exists('license.json'):
            self.MAX_USERS = 1
            return 
            
        with open('license.json', 'r') as f:
            license = json.load(f)
            self.MAX_USERS = int(license['license']['number_users'])

    def track_user(self, request):
        """
        For each request, 
            1. Ensure that no more than MAX_USERS simultaneously log 
                in.
            2. Ensure that the same user does not use more than 1 computer within 60 seconds of another request.
        """

        user = request.user
        if user in self.users:
            info = self.get_user_info(user)
            info.verify_request(request)
            
        else:
            if len(self.users) >= self.MAX_USERS:
                logger.critical(
                    'More users than licensed are logging in to the server')
                raise UserTrackerException(
                    "More users than allowed are logged in")
            self.add_user(user, request)

    def get_user_info(self, user):
        """
        Returns an instance of UserInfo for a given user
        """
        for info in self.users_info:
            if info.user == user:
                return info


    def add_user(self, user, request):
        """
        Adds a user to the list of users and an instance of UserInfo to the
        list of users_info
        """
        self.users.append(user)
        self.users_info.append(
            UserInfo(user, request.META["REMOTE_ADDR"]))

#the tracker is reset every time the server is restarted
TRACKER = UserTracker()
HID = GlobalConfig.generate_hardware_id()

def license_check():
    license = None
    try:
        #installer requires license in top level directory
        with open('license.json', 'r') as f:
            license = json.load(f)
    
    except FileNotFoundError:
        return 'license not found'

    data_string = HID + json.dumps(license['license'])
    byte_data = bytes(data_string, 'ascii')
    hash = hashlib.sha3_512(byte_data).hexdigest()

    if not hmac.compare_digest(hash, license['signature']):
        return 'license signatures do not match'

    if not license['license']['expiry_date'] == "*":
        expiry = datetime.datetime.strptime(
            license['license']['expiry_date'], '%d/%m/%Y')

    if datetime.date.today() > expiry.date():
        return f'The license expired on {expiry.date}'
        
    return 'ok'

class LicenseMiddleware(object):
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        """
        Checks that each request is within the limits of the purchased license.
            1. Checks that the users are not using the same account on multiple 
                machines.
            2. Verifies that the license file has not been tampered with.
        """

        #condition is evaluated to ensure an infinite loop is avoided
        if request.path.startswith('/base/license-check') or \
                'api' in request.path or \
                request.path.startswith('/admin') or \
                request.path.startswith('/base/reset-license-check'):
            return self.get_response(request)

        try:
            TRACKER.track_user(request)
        except UserTrackerException:
            return HttpResponseRedirect('/base/license-check')
        
        output = license_check()
        if output != 'ok':
            logger.critical(output)
            return HttpResponseRedirect('/base/license-check')

        return self.get_response(request)