# Generated by Django 2.2.10 on 2020-04-15 13:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('invoicing', '0023_auto_20200324_0727'),
    ]

    operations = [
        migrations.AlterField(
            model_name='lead',
            name='notes',
            field=models.ManyToManyField(blank=True, to='common_data.Note'),
        ),
    ]
