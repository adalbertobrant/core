from django.db import models
from invoicing.models.sales_rep import SalesRepresentative
import datetime
from django.shortcuts import reverse
from statistics import mean

try:
    default_rep = SalesRepresentative.objects.first().pk \
        if SalesRepresentative.objects.first() else 1
except:
    default_rep = 1


class LeadSource(models.Model):
    name = models.CharField(max_length=64)
    description = models.TextField()

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse("invoicing:list-lead-sources")

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

class InteractionType(models.Model):
    name = models.CharField(max_length=64)
    description = models.TextField()

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse("invoicing:list-interaction-types")


class Lead(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    owner = models.ForeignKey('invoicing.SalesRepresentative',
                              on_delete=models.SET_DEFAULT,
                              default=default_rep)
    team = models.ForeignKey('invoicing.SalesTeam', null=True,
                             blank=True,
                             on_delete=models.SET_NULL)
    created = models.DateTimeField(auto_now=True)
    notes = models.ManyToManyField('common_data.Note')
    projected_closing = models.DateField(blank=True, null=True)
    source = models.ForeignKey('invoicing.LeadSource',
                               on_delete=models.SET_DEFAULT, default=1)
    contacts = models.ManyToManyField('common_data.Individual')
    organization = models.ForeignKey('common_data.Organization', null=True, blank=True,
                                     on_delete=models.SET_NULL)
    opportunity = models.FloatField(default=0.0)
    probability_of_sale = models.FloatField(default=100.0)
    status = models.CharField(default='lead', max_length=16, choices=[
        ('new', 'New'),
        ('qualified', 'Qualified'),
        ('quotation', 'Quotation'),
        ('won', 'Won'),
        ('lost', 'Lost')])


    @property
    def last_interaction(self):
        return self.interaction_set.latest('timestamp')

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse("invoicing:lead-details", kwargs={"pk": self.pk})


class Interaction(models.Model):
    lead = models.ForeignKey('invoicing.Lead', on_delete=models.SET_NULL,
                             null=True)
    timestamp = models.DateTimeField(auto_now=True)
    description = models.TextField(blank=True)
    contact = models.ForeignKey('common_data.Individual',
                                on_delete=models.SET_NULL, null=True)
    sales_representative = models.ForeignKey('invoicing.SalesRepresentative',
                                             null=True, on_delete=models.SET_NULL)
    type = models.ForeignKey('invoicing.InteractionType',
                             on_delete=models.SET_DEFAULT, default=1)

    def __str__(self):
        return self.description

    def get_absolute_url(self):
        return reverse("invoicing:lead-details", kwargs={"pk": self.lead.pk})


class Task(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    status = models.CharField(default='planned', max_length=16, choices=[
        ('planned', 'Planned'),
        ('progress', 'In Progress'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ])
    created = models.DateTimeField(auto_now=True)
    due = models.DateField()
    lead = models.ForeignKey('invoicing.Lead', on_delete=models.CASCADE)
    event = models.ForeignKey('planner.Event', on_delete=models.SET_NULL,
                              null=True)
    assigned = models.ForeignKey('invoicing.SalesRepresentative', null=True,
                                 on_delete=models.SET_NULL)



    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse("invoicing:task-detail", kwargs={"pk": self.pk})


class SalesTeam(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    members = models.ManyToManyField('invoicing.SalesRepresentative')
    leader = models.ForeignKey('invoicing.SalesRepresentative', null=True,
                               on_delete=models.SET_NULL, related_name='leader')

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse("invoicing:list-sales-teams")
