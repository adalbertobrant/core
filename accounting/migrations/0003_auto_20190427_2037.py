# Generated by Django 2.2 on 2019-04-27 18:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounting', '0002_auto_20190402_0609'),
    ]

    operations = [
        migrations.AddField(
            model_name='account',
            name='is_configured',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='interestbearingaccount',
            name='is_configured',
            field=models.BooleanField(default=False),
        ),
    ]