from invoicing import models
from employees import models as employee_models
from django.http import JsonResponse, HttpResponse
import json 
import datetime
from inventory.models import InventoryItem
from accounting.models import Tax
from invoicing.models import ProductLineComponent


def process_sale(request):
    data = json.loads(request.body)
    print(data)
    timestamp = datetime.datetime.strptime(data['timestamp'].split('.')[0],
        '%Y-%m-%dT%H:%M:%S')
    session = models.POSSession.objects.get(pk=data['session'])
    sales_person = models.SalesRepresentative.objects.get(
        pk=data['invoice']['sales_person'].split('-')[0]
        )
    # support having a generic customer
    customer = models.Customer.objects.get(
        pk=data['invoice']['customer'].split('-')[0]
    )
    invoice = models.Invoice.objects.create(
        date=timestamp.date(),
        due=timestamp.date(),
        customer=customer,
        salesperson=sales_person,
        draft=False
    )
    for line in data['invoice']['lines']:
        product = InventoryItem.objects.get(pk=line['id'])
        component = ProductLineComponent.objects.create(
            product=product,
            unit_price=line['price'],
            quantity=line['quantity']

        )
        tax = None 
        if line['tax']:
            tax = Tax.objects.get(line['tax']['id'])

        models.InvoiceLine.objects.create(
            invoice=invoice,
            product=component,
            line_type=1,
            tax=tax
        )
    

    sale = models.POSSale.objects.create(
        session=session,
        invoice=invoice,
        timestamp=timestamp
    )
    
    for payment in data['payments']:
        models.Payment.objects.create(
            invoice=invoice,
            amount=payment['tendered'],
            date=timestamp.date(),
            sales_rep=sales_person,
            timestamp=timestamp,
            method=payment['method']
        )
    return JsonResponse({'sale_id': invoice.pk})

def start_session(request):
    data = json.loads(request.body)
    timestamp = datetime.datetime.strptime(data['timestamp'].split('.')[0],
        '%Y-%m-%dT%H:%M:%S')
    
    pk = data['sales_person'].split('-')[0]
    sales_person = employee_models.Employee.objects.get(
        pk=pk
    )
    session = models.POSSession.objects.create(
        start=timestamp,
        sales_person = sales_person
    )

    # return a session id
    return JsonResponse({'id': session.pk})


#if a session is unended, use the timestamp of the last sale to end the session
def end_session(request):
    data = json.loads(request.body)
    timestamp =  datetime.datetime.strptime(data['timestamp'].split('.')[0],
        '%Y-%m-%dT%H:%M:%S')
    print('timestamp')
    session = models.POSSession.objects.get(pk=data['id'])
    session.end = timestamp
    session.save()
    return JsonResponse({
        'status': 'OK'
    })