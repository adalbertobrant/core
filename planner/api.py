import calendar
import datetime
import time

from django.db.models import Q
from django.http import JsonResponse

from inventory.models import InventoryCheck
from invoicing.models.invoice import Invoice

from .l2d import List2D
from .models import Event

def get_filters(start, end, field="date"):
    lt = field + '__lte'
    gt = field + '__gte'
    return(Q(Q(**{lt: end}) & Q(**{gt: start})))


def get_events(user, filters):
    if hasattr(user, 'employee'):
        events = Event.objects.filter(filters & Q(
                Q(owner=user) | Q(eventparticipant__employee__in=[user.employee.pk])))
    else:
        events = Event.objects.filter(filters & Q(owner=user))

    return events

def get_month_events(request, year=None, month=None):
    year = int(year)
    month=int(month)
    user = request.user
    first = datetime.date(year,month, 1)
    last = datetime.date(year, month, calendar.monthrange(year, month)[1])
    filters = get_filters(first, last)
    events = get_events(user, filters)
    
    return JsonResponse([{
        'date': evt.date,
        'title': evt.label,
        'id': evt.pk
        } for evt in events], safe=False)

def get_week_events(request, year=None, month=None, day=None):
    year = int(year)
    month= int(month)
    day=int(day)


    current_date = datetime.date(year, month, day)
    curr_weekday = current_date.weekday()
    first = current_date + datetime.timedelta(days=(0 - curr_weekday))
    last = current_date + datetime.timedelta(days=(7 - curr_weekday))
    filters = get_filters(first, last)
    user = request.user

    events = get_events(user, filters)

        
    return JsonResponse([{
        'date': evt.date,
        'title': evt.label,
        'id': evt.pk,
        'start': evt.start_time,
        'end': evt.end_time
        } for evt in events], safe=False)

def get_day_events(request, year=None, month=None, day=None):
    year = int(year)
    month= int(month)
    day=int(day)

    current_date = datetime.date(year, month, day)
    user = request.user
    if hasattr(user, 'employee'):
        events = Event.objects.filter(Q(date=current_date) & Q(
                Q(owner=user) | Q(eventparticipant__employee__in=[user.employee.pk])))
    else:
        events = Event.objects.filter(Q(date=current_date) & Q(owner=user))
        
    return JsonResponse([{
        'date': evt.date,
        'title': evt.label,
        'id': evt.pk,
        'start': evt.start_time,
        'end': evt.end_time,
        'description': evt.description
        } for evt in events], safe=False)