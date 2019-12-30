from django.db import models

class POSSession(models.Model):
    start = models.DateTimeField(auto_now=False, auto_now_add=False) 
    end = models.DateTimeField(auto_now=False, auto_now_add=False, null=True, 
        blank=True)
    sales_person = models.ForeignKey('employees.employee', 
        on_delete=models.CASCADE)

    def __str__(self):
        return "%s: %s" % (str(self.sales_person), self.start.date)
    

class POSSale(models.Model):
    invoice = models.ForeignKey('invoicing.Invoice', 
        on_delete=models.CASCADE)
    session = models.ForeignKey("invoicing.POSSession", 
        on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now=False)