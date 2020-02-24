# Generated by Django 2.1 on 2020-02-18 17:38

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('employees', '0024_payrollofficer_active'),
        ('services', '0011_auto_20200208_1204'),
    ]

    operations = [
        migrations.CreateModel(
            name='WorkOrderTask',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.TextField()),
                ('due', models.DateField(blank=True)),
                ('completed', models.BooleanField(default=False)),
                ('assigned', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='employees.Employee')),
            ],
        ),
        migrations.RemoveField(
            model_name='serviceworkorder',
            name='manual_progress',
        ),
        migrations.RemoveField(
            model_name='serviceworkorder',
            name='progress',
        ),
        migrations.AddField(
            model_name='workordertask',
            name='work_order',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='services.ServiceWorkOrder'),
        ),
    ]