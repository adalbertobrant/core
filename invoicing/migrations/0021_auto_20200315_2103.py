# Generated by Django 2.2.10 on 2020-03-15 21:03

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('invoicing', '0020_auto_20200302_0736'),
    ]

    operations = [
        migrations.AlterField(
            model_name='lead',
            name='organization',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='common_data.Organization'),
        ),
        migrations.AlterField(
            model_name='lead',
            name='team',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='invoicing.SalesTeam'),
        ),
    ]