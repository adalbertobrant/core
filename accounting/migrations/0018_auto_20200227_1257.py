# Generated by Django 2.1 on 2020-02-27 12:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounting', '0017_auto_20200207_0637'),
    ]

    operations = [
        migrations.AddField(
            model_name='expense',
            name='attachment',
            field=models.ImageField(blank=True, null=True, upload_to='expenses'),
        ),
        migrations.AddField(
            model_name='recurringexpense',
            name='attachment',
            field=models.ImageField(blank=True, null=True, upload_to='expenses'),
        ),
    ]