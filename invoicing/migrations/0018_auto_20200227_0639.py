# Generated by Django 2.1 on 2020-02-27 06:39

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('invoicing', '0017_auto_20200218_1738'),
    ]

    operations = [
        migrations.CreateModel(
            name='CustomerNote',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('note', models.TextField()),
                ('author', models.CharField(max_length=255)),
                ('timestamp', models.DateTimeField(auto_now=True)),
                ('customer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='invoicing.Customer')),
            ],
        ),
        migrations.AlterField(
            model_name='lead',
            name='owner',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.SET_DEFAULT, to='invoicing.SalesRepresentative'),
        ),
    ]