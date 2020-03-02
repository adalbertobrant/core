from django.db import models
from invoicing.models.sales_rep import SalesRepresentative
import datetime
from common_data.models import Individual
from django.shortcuts import reverse

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
        on_delete=models.SET_NULL)
    created = models.DateTimeField(auto_now=True)
    projected_closing = models.DateField(blank=True, null=True)
    source = models.ForeignKey('invoicing.LeadSource', 
        on_delete=models.SET_DEFAULT, default=1)
    contacts = models.ManyToManyField('common_data.Individual')
    organization = models.ForeignKey('common_data.Organization', null=True, 
        on_delete=models.SET_NULL)
    opportunity = models.FloatField(default=0.0)
    probability_of_sale = models.FloatField(default=100.0)
    status = models.CharField(default='lead', max_length=16, choices=[
        ('lead', 'Lead'),
        ('quotation',' Quotation'),
        ('invoice', 'Invoice'),
        ('sale', 'Sale'),
        ('cold', 'Cold')])


    @property
    def lead_cold(self):
        return self.projected_closing < datetime.date.today()

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse("invoicing:lead-detail", kwargs={"pk": self.pk})


class Interaction(models.Model):
    lead = models.ForeignKey('invoicing.Lead', on_delete=models.SET_NULL, 
        null=True)
    timestamp = models.DateTimeField(auto_now=True)
    description = models.TextField(blank=True)
    notes = models.ManyToManyField('common_data.Note')
    contact = models.ForeignKey('common_data.Individual', 
        on_delete=models.SET_NULL, null=True)
    sales_representative = models.ForeignKey('invoicing.SalesRepresentative', 
        null=True, on_delete=models.SET_NULL)
    type = models.ForeignKey('invoicing.InteractionType', 
        on_delete=models.SET_DEFAULT, default=1)

    def __str__(self):
        return self.description

    def get_absolute_url(self):
        return reverse("invoicing:lead-detail", kwargs={"pk": self.lead.pk})
    
    
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

    def set_event(self):
        raise NotImplementedError()

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
    
