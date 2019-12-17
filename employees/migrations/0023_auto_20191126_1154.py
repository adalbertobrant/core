# Generated by Django 2.1 on 2019-11-26 11:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('employees', '0022_auto_20190927_0513'),
    ]

    operations = [
        migrations.AlterField(
            model_name='deduction',
            name='benefits',
            field=models.ManyToManyField(blank=True, to='employees.Allowance'),
        ),
        migrations.AlterField(
            model_name='deduction',
            name='commission',
            field=models.ManyToManyField(blank=True, to='employees.CommissionRule'),
        ),
        migrations.AlterField(
            model_name='deduction',
            name='payroll_taxes',
            field=models.ManyToManyField(blank=True, to='employees.PayrollTax'),
        ),
    ]
