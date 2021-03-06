# Generated by Django 2.1.8 on 2019-07-23 18:48

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('employees', '0012_payslip_created'),
        ('services', '0003_workorderrequest_description'),
    ]

    operations = [
        migrations.AddField(
            model_name='workorderrequest',
            name='created',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='workorderrequest',
            name='created_by',
            field=models.ForeignKey(
                null=True, on_delete=django.db.models.deletion.SET_NULL, to='employees.Employee'),
        ),
    ]
