# Generated by Django 2.2.13 on 2020-09-20 13:49

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounting', '0024_remove_accountingsettings_default_accounting_period'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='account',
            name='currency',
        ),
        migrations.RemoveField(
            model_name='interestbearingaccount',
            name='currency',
        ),
    ]
