# Generated by Django 2.1.8 on 2019-05-05 03:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('common_data', '0006_merge_20190429_1214'),
    ]

    operations = [
        migrations.AddField(
            model_name='globalconfig',
            name='logo_aspect_ratio',
            field=models.PositiveSmallIntegerField(choices=[(1, '3:2 (Medium rectangle)'), (
                2, '1:1 (Square)'), (3, '4:3 (Narrower Rectangle)'), (0, ':16:9 (Wide Rectangle)')], default=0),
        ),
    ]
