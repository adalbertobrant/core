
from django.db import models


class Currency(models.Model):
    name = models.CharField(max_length=255)
    symbol = models.CharField(max_length=8)

    def __str__(self):
        return self.name

class ExchangeRate(models.Model):
    date = models.DateField()
    from_currency = models.ForeignKey('accounting.Currency',
        on_delete=models.CASCADE, related_name="from_currency")
    to_currency = models.ForeignKey('accounting.Currency', 
        on_delete=models.CASCADE, related_name="to_currency")
    exchange_rate = models.FloatField(default=1.0)

    def __str__(self):
        return "%s to %s" % (self.from_currency, self.to_currency)