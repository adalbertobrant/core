# Generated by Django 2.1.4 on 2019-04-02 04:09

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('accounting', '0002_auto_20190402_0609'),
        ('employees', '0001_initial'),
        ('services', '0001_initial'),
        ('invoicing', '0002_auto_20190402_0609'),
        ('inventory', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='BillOfMaterials',
            fields=[
                ('id', models.AutoField(auto_created=True,
                                        primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='BillOfMaterialsLine',
            fields=[
                ('id', models.AutoField(auto_created=True,
                                        primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.PositiveSmallIntegerField(
                    choices=[(0, 'Raw Material'), (1, 'Process Product')])),
                ('quantity', models.FloatField()),
                ('bill', models.ForeignKey(
                    null=True, on_delete=django.db.models.deletion.SET_NULL, to='manufacturing.BillOfMaterials')),
            ],
        ),
        migrations.CreateModel(
            name='ManufacturingAssociate',
            fields=[
                ('id', models.AutoField(auto_created=True,
                                        primary_key=True, serialize=False, verbose_name='ID')),
                ('employee', models.ForeignKey(
                    null=True, on_delete=django.db.models.deletion.SET_NULL, to='employees.Employee')),
            ],
        ),
        migrations.CreateModel(
            name='Process',
            fields=[
                ('id', models.AutoField(auto_created=True,
                                        primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField(blank=True)),
                ('type', models.PositiveSmallIntegerField(
                    choices=[(0, 'Line'), (1, 'Batch')])),
                ('duration', models.DurationField(blank=True, null=True)),
                ('bill_of_materials', models.ForeignKey(blank=True, null=True,
                                                        on_delete=django.db.models.deletion.SET_NULL, to='manufacturing.BillOfMaterials')),
                ('parent_process', models.ForeignKey(blank=True, null=True,
                                                     on_delete=django.db.models.deletion.SET_NULL, to='manufacturing.Process')),
            ],
        ),
        migrations.CreateModel(
            name='ProcessMachine',
            fields=[
                ('id', models.AutoField(auto_created=True,
                                        primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('date_commissioned', models.DateField()),
                ('asset_data', models.ForeignKey(
                    null=True, on_delete=django.db.models.deletion.SET_NULL, to='accounting.Asset')),
            ],
        ),
        migrations.CreateModel(
            name='ProcessMachineGroup',
            fields=[
                ('id', models.AutoField(auto_created=True,
                                        primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='ProcessProduct',
            fields=[
                ('id', models.AutoField(auto_created=True,
                                        primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('type', models.PositiveSmallIntegerField(choices=[
                 (0, 'Product'), (1, 'By-Product'), (2, 'Co-Product'), (3, 'Waste')])),
                ('finished_goods', models.BooleanField(default=False)),
                ('inventory_product', models.ForeignKey(
                    null=True, on_delete=django.db.models.deletion.SET_NULL, to='inventory.InventoryItem')),
            ],
        ),
        migrations.CreateModel(
            name='ProcessRate',
            fields=[
                ('id', models.AutoField(auto_created=True,
                                        primary_key=True, serialize=False, verbose_name='ID')),
                ('unit_time', models.PositiveSmallIntegerField(choices=[
                 (0, 'per second'), (1, 'per minute'), (2, 'per hour')])),
                ('quantity', models.FloatField(default=0.0)),
                ('unit', models.ForeignKey(
                    null=True, on_delete=django.db.models.deletion.SET_NULL, to='inventory.UnitOfMeasure')),
            ],
        ),
        migrations.CreateModel(
            name='ProductionOrder',
            fields=[
                ('id', models.AutoField(auto_created=True,
                                        primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('due', models.DateField()),
                ('customer', models.ForeignKey(blank=True, null=True,
                                               on_delete=django.db.models.deletion.SET_NULL, to='invoicing.Customer')),
                ('process', models.ForeignKey(
                    null=True, on_delete=django.db.models.deletion.SET_NULL, to='manufacturing.Process')),
                ('product', models.ForeignKey(
                    null=True, on_delete=django.db.models.deletion.SET_NULL, to='inventory.InventoryItem')),
            ],
        ),
        migrations.CreateModel(
            name='ProductionSchedule',
            fields=[
                ('id', models.AutoField(auto_created=True,
                                        primary_key=True, serialize=False, verbose_name='ID')),
                ('machine', models.ForeignKey(
                    null=True, on_delete=django.db.models.deletion.SET_NULL, to='manufacturing.ProcessMachine')),
            ],
        ),
        migrations.CreateModel(
            name='ProductionScheduleLine',
            fields=[
                ('id', models.AutoField(auto_created=True,
                                        primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('start_time', models.TimeField()),
                ('duration', models.DurationField()),
                ('order', models.ForeignKey(
                    null=True, on_delete=django.db.models.deletion.SET_NULL, to='manufacturing.ProductionOrder')),
            ],
        ),
        migrations.CreateModel(
            name='ProductList',
            fields=[
                ('id', models.AutoField(auto_created=True,
                                        primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Shift',
            fields=[
                ('id', models.AutoField(auto_created=True,
                                        primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('employees', models.ManyToManyField(to='employees.Employee')),
                ('machine', models.ForeignKey(default=1, null=True,
                                              on_delete=django.db.models.deletion.SET_NULL, to='manufacturing.ProcessMachine')),
                ('supervisor', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL,
                                                 related_name='supervisor', to='employees.Employee')),
                ('team', models.ForeignKey(blank=True, null=True,
                                           on_delete=django.db.models.deletion.SET_NULL, to='services.ServiceTeam')),
            ],
        ),
        migrations.CreateModel(
            name='ShiftSchedule',
            fields=[
                ('id', models.AutoField(auto_created=True,
                                        primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='ShiftScheduleLine',
            fields=[
                ('id', models.AutoField(auto_created=True,
                                        primary_key=True, serialize=False, verbose_name='ID')),
                ('start_time', models.TimeField()),
                ('end_time', models.TimeField()),
                ('monday', models.BooleanField(default=True)),
                ('tuesday', models.BooleanField(default=True)),
                ('wednesday', models.BooleanField(default=True)),
                ('thursday', models.BooleanField(default=True)),
                ('friday', models.BooleanField(default=True)),
                ('saturday', models.BooleanField(default=False)),
                ('sunday', models.BooleanField(default=False)),
                ('schedule', models.ForeignKey(
                    null=True, on_delete=django.db.models.deletion.SET_NULL, to='manufacturing.ShiftSchedule')),
                ('shift', models.ForeignKey(
                    null=True, on_delete=django.db.models.deletion.SET_NULL, to='manufacturing.Shift')),
            ],
        ),
        migrations.CreateModel(
            name='WasteGenerationReport',
            fields=[
                ('id', models.AutoField(auto_created=True,
                                        primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.FloatField()),
                ('comments', models.TextField()),
                ('product', models.ForeignKey(
                    null=True, on_delete=django.db.models.deletion.SET_NULL, to='manufacturing.ProcessProduct')),
                ('recorded_by', models.ForeignKey(
                    null=True, on_delete=django.db.models.deletion.SET_NULL, to='employees.Employee')),
                ('unit', models.ForeignKey(
                    null=True, on_delete=django.db.models.deletion.SET_NULL, to='inventory.UnitOfMeasure')),
            ],
        ),
        migrations.AddField(
            model_name='processproduct',
            name='product_list',
            field=models.ForeignKey(
                blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='manufacturing.ProductList'),
        ),
        migrations.AddField(
            model_name='processproduct',
            name='unit',
            field=models.ForeignKey(
                null=True, on_delete=django.db.models.deletion.SET_NULL, to='inventory.UnitOfMeasure'),
        ),
        migrations.AddField(
            model_name='processmachine',
            name='machine_group',
            field=models.ForeignKey(
                blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='manufacturing.ProcessMachineGroup'),
        ),
        migrations.AddField(
            model_name='process',
            name='process_equipment',
            field=models.ForeignKey(
                blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='manufacturing.ProcessMachineGroup'),
        ),
        migrations.AddField(
            model_name='process',
            name='product_list',
            field=models.ForeignKey(
                blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='manufacturing.ProductList'),
        ),
        migrations.AddField(
            model_name='process',
            name='rate',
            field=models.ForeignKey(
                blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='manufacturing.ProcessRate'),
        ),
        migrations.AddField(
            model_name='billofmaterialsline',
            name='product',
            field=models.ForeignKey(
                blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='manufacturing.ProcessProduct'),
        ),
        migrations.AddField(
            model_name='billofmaterialsline',
            name='raw_material',
            field=models.ForeignKey(
                blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='inventory.InventoryItem'),
        ),
        migrations.AddField(
            model_name='billofmaterialsline',
            name='unit',
            field=models.ForeignKey(
                null=True, on_delete=django.db.models.deletion.SET_NULL, to='inventory.UnitOfMeasure'),
        ),
    ]
