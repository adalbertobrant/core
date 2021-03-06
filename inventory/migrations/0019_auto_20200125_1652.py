# Generated by Django 2.1 on 2020-01-25 16:52

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('inventory', '0018_inventorycontroller_active'),
    ]

    operations = [
        migrations.AlterField(
            model_name='inventorycheck',
            name='adjusted_by',
            field=models.ForeignKey(limit_choices_to=models.Q(
                active=True), null=True, on_delete=django.db.models.deletion.SET_NULL, to='inventory.InventoryController'),
        ),
        migrations.AlterField(
            model_name='inventorycontroller',
            name='employee',
            field=models.OneToOneField(limit_choices_to=models.Q(models.Q(('user__isnull', False), (
                'active', True))), null=True, on_delete=django.db.models.deletion.SET_NULL, to='employees.Employee'),
        ),
        migrations.AlterField(
            model_name='inventoryscrappingrecord',
            name='controller',
            field=models.ForeignKey(limit_choices_to=models.Q(
                active=True), null=True, on_delete=django.db.models.deletion.SET_NULL, to='inventory.InventoryController'),
        ),
        migrations.AlterField(
            model_name='order',
            name='issuing_inventory_controller',
            field=models.ForeignKey(default=1, limit_choices_to=models.Q(
                active=True), null=True, on_delete=django.db.models.deletion.SET_NULL, to='inventory.InventoryController'),
        ),
        migrations.AlterField(
            model_name='stockreceipt',
            name='received_by',
            field=models.ForeignKey(default=1, limit_choices_to=models.Q(
                active=True), null=True, on_delete=django.db.models.deletion.SET_NULL, to='inventory.InventoryController'),
        ),
        migrations.AlterField(
            model_name='transferorder',
            name='issuing_inventory_controller',
            field=models.ForeignKey(limit_choices_to=models.Q(active=True), null=True, on_delete=django.db.models.deletion.SET_NULL,
                                    related_name='issuing_inventory_controller', to='inventory.InventoryController'),
        ),
        migrations.AlterField(
            model_name='transferorder',
            name='receiving_inventory_controller',
            field=models.ForeignKey(limit_choices_to=models.Q(
                active=True), null=True, on_delete=django.db.models.deletion.SET_NULL, to='inventory.InventoryController'),
        ),
        migrations.AlterField(
            model_name='warehouse',
            name='inventory_controller',
            field=models.ForeignKey(blank=True, limit_choices_to=models.Q(
                active=True), null=True, on_delete=django.db.models.deletion.SET_NULL, to='inventory.InventoryController'),
        ),
    ]
