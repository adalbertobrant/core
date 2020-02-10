# Generated by Django 2.1 on 2020-02-09 15:17

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('inventory', '0019_auto_20200125_1652'),
        ('invoicing', '0014_auto_20200208_1910'),
    ]

    operations = [
        # migrations.RemoveField(
        #     model_name='contact',
        #     name='individual_ptr',
        # ),
        migrations.AlterField(
            model_name='interaction',
            name='contact',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='common_data.Individual'),
        ),
        migrations.AlterField(
            model_name='lead',
            name='contacts',
            field=models.ManyToManyField(to='common_data.Individual'),
        ),
        migrations.DeleteModel(
            name='Contact',
        ),
    ]