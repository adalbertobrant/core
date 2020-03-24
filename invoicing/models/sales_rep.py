
from django.db import models
from django.db.models import Q

from invoicing.models.invoice import Invoice
from common_data.models import SoftDeletionModel
from statistics import mean
import datetime

class SalesRepresentative(SoftDeletionModel):
    '''Really just a dummy class that points to an employee. 
    allows sales and commission to be tracked.

    methods
    ---------
    sales - takes two dates as arguments and returns the 
    amount sold exclusive of tax. Used in commission calculation
    '''
    employee = models.OneToOneField('employees.Employee',
                                    on_delete=models.CASCADE,
                                    limit_choices_to=Q(
                                        Q(active=True), Q(user__isnull=False)),
                                    null=True,)
    number = models.AutoField(primary_key=True)
    can_validate_invoices = models.BooleanField(default=True)
    can_offer_discounts = models.BooleanField(default=True)

    def __str__(self):
        return self.employee.first_name + ' ' + self.employee.last_name

    @property 
    def cumulative_sales(self):
        first = Invoice.objects.first().date
        last = Invoice.objects.latest('date').date

        return self.sales(first, last)

    def sales(self, start, end):
        '''
        Sales only count for paid invoices
        '''
        invoices = Invoice.objects.filter(Q(
                                            Q(status="invoice") |
                                            Q(status='paid') | 
                                            Q(status='paid-partiailly') 
                                        ) &
                                          Q(salesperson=self)
                                          & (Q(due__lt=end)
                                             | Q(due__gte=start)))

        # exclude tax in the calculation
        return sum([i.subtotal for i in invoices])

    @property
    def active_leads(self):
        return self.lead_set.all().exclude(status='lost').order_by('created')

    @property
    def mean_time_to_response(self):
        '''Calculated from the creation of the lead to the recording of the first interaction'''
        response_times = []
        for lead in self.lead_set.all():
            qs = lead.interaction_set.first()
            if not qs:
                continue
            
            resp_time = qs.timestamp - lead.created 
            response_times.append(resp_time.seconds)
        if len(response_times) == 0:
            return 0
        return datetime.timedelta(seconds=mean(response_times))

    @property
    def lead_conversion_rate(self):
        leads = self.lead_set.all().count()
        sales = self.lead_set.filter(status='won').count()
        if leads > 0:
            return (sales / leads) * 100.0

        return 0

    @property
    def average_probability_of_sale(self):
        if self.lead_set.all().count() > 0:
            return mean([i.probability_of_sale for i in self.lead_set.all()])
        return 0
        #use lead conversion rate to calculate probability on the fly