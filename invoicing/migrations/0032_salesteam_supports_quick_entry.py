# Generated by Django 2.2.13 on 2020-09-23 09:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('invoicing', '0031_leadsource_supports_quick_entry'),
    ]

    operations = [
        migrations.AddField(
            model_name='salesteam',
            name='supports_quick_entry',
            field=models.BooleanField(default=True),
        ),
    ]
