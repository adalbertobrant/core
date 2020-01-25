# Generated by Django 2.1 on 2020-01-25 16:52

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('invoicing', '0010_salesconfig_default_warehouse'),
    ]

    operations = [
        migrations.AlterField(
            model_name='invoice',
            name='salesperson',
            field=models.ForeignKey(default=1, limit_choices_to=models.Q(active=True), null=True, on_delete=django.db.models.deletion.SET_NULL, to='invoicing.SalesRepresentative'),
        ),
        migrations.AlterField(
            model_name='payment',
            name='sales_rep',
            field=models.ForeignKey(limit_choices_to=models.Q(active=True), null=True, on_delete=django.db.models.deletion.SET_NULL, to='invoicing.SalesRepresentative'),
        ),
        migrations.AlterField(
            model_name='salesrepresentative',
            name='employee',
            field=models.OneToOneField(limit_choices_to=models.Q(active=True), null=True, on_delete=django.db.models.deletion.SET_NULL, to='employees.Employee'),
        ),
    ]
