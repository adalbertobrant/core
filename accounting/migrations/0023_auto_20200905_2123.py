# Generated by Django 2.2.10 on 2020-09-05 21:23

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('accounting', '0022_auto_20200802_1523'),
    ]

    operations = [
        migrations.CreateModel(
            name='ExchangeRate',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('exchange_rate', models.FloatField(default=1.0)),
                ('from_currency', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='from_currency', to='accounting.Currency')),
                ('to_currency', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='to_currency', to='accounting.Currency')),
            ],
        ),
        migrations.RemoveField(
            model_name='currencyconversiontable',
            name='reference_currency',
        ),
        migrations.RemoveField(
            model_name='accountingsettings',
            name='currency_exchange_table',
        ),
        migrations.AddField(
            model_name='account',
            name='currency',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='accounting.Currency'),
        ),
        migrations.AddField(
            model_name='interestbearingaccount',
            name='currency',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='accounting.Currency'),
        ),
        migrations.DeleteModel(
            name='CurrencyConversionLine',
        ),
        migrations.DeleteModel(
            name='CurrencyConversionTable',
        ),
    ]
