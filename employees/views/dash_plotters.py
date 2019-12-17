import pygal
from pygal.style import DefaultStyle

from django.db.models import Q
from employees import models
from services.models import ServicePerson
from invoicing.models import SalesRepresentative
from accounting.models import Bookkeeper
from inventory.models import InventoryController


def employee_roles_chart():
    # take all 5 role categories and count the number of employees with each role
    # plot that count in a pie chart
    roles = {'Payroll Officers': models.PayrollOfficer, 
            'Bookkeepers':Bookkeeper, 
            'Service People':ServicePerson, 
            'Sales Representatives':SalesRepresentative, 
            'Inventory Controllers':InventoryController}

    chart = pygal.Pie(print_values=True, style=DefaultStyle(
        value_font_size=30, 
        value_colors=('white', )
        ) 
    )
    for role in roles.keys():
        chart.add(role, roles[role].objects.all().count())

    chart.add('Other', models.Employee.objects.filter(
        bookkeeper__isnull=True,
        serviceperson__isnull=True,
        salesrepresentative__isnull=True,
        inventorycontroller__isnull=True,
        payrollofficer__isnull=True
    ).count())
    return chart