# Generated by Django 2.1.8 on 2019-05-30 13:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('messaging', '0007_userprofile'),
    ]

    operations = [
        migrations.AddField(
            model_name='email',
            name='server_id',
            field=models.CharField(blank=True, default='', max_length=16),
        ),
    ]
