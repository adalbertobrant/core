# Generated by Django 2.2.13 on 2020-09-20 13:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('invoicing', '0028_invoice_exchange_rate'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='supports_quick_entry',
            field=models.BooleanField(default=True),
        ),
    ]