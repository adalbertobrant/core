# Generated by Django 2.1 on 2020-02-10 12:05

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('invoicing', '0015_auto_20200209_1517'),
    ]

    operations = [
        migrations.AlterField(
            model_name='salesrepresentative',
            name='employee',
            field=models.OneToOneField(limit_choices_to=models.Q(models.Q(active=True), models.Q(
                user__isnull=False)), null=True, on_delete=django.db.models.deletion.CASCADE, to='employees.Employee'),
        ),
    ]
