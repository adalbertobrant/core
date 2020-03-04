# Generated by Django 2.1 on 2019-09-23 12:26

from decimal import Decimal
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('services', '0006_auto_20190903_1336'),
    ]

    operations = [
        migrations.AlterField(
            model_name='service',
            name='flat_fee',
            field=models.DecimalField(decimal_places=2, max_digits=16),
        ),
        migrations.AlterField(
            model_name='service',
            name='hourly_rate',
            field=models.DecimalField(decimal_places=2, max_digits=16),
        ),
        migrations.AlterField(
            model_name='timelog',
            name='normal_time_cost',
            field=models.DecimalField(
                decimal_places=2, default=Decimal('0'), max_digits=16),
        ),
        migrations.AlterField(
            model_name='timelog',
            name='overtime_cost',
            field=models.DecimalField(
                decimal_places=2, default=Decimal('0'), max_digits=16),
        ),
    ]
