from django import forms
from crispy_forms.bootstrap import TabHolder, Tab
from common_data.forms import BootstrapMixin
from django.contrib.auth import authenticate
from crispy_forms.helper import FormHelper

from crispy_forms.layout import (Row,
                                 Column,
                                 Fieldset,
                                 Submit,
                                 Div,
                                 Layout,
                                 HTML)
from . import models
from employees.models import Employee
from django_select2.forms import Select2Widget


class ServiceForm(forms.ModelForm, BootstrapMixin):
    category = forms.ModelChoiceField(
        models.ServiceCategory.objects.all(), required=False)

    class Meta:
        fields = "__all__"
        model = models.Service

        widgets = {
            'description': forms.Textarea(attrs={'rows': 4, 'cols': 15}),
            'procedure': Select2Widget(attrs={'data-width': '20rem'})
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.layout = Layout(
                    'name',
                    Row(
                        Column(
                            'flat_fee', css_class='form-group col-md-6 col-sm-12'),
                        Column(
                            'hourly_rate', css_class='form-group col-md-6 col-sm-12'),
                    ),
                    'description',
                    Row(
                        Column(
                            'category', css_class='form-group col-md-4 col-sm-12'),
                        Column(
                            'procedure', css_class='form-group col-md-4 col-sm-12'),
                        Column(
                            'frequency', css_class='form-group col-md-4 col-sm-12'),
                    ),
                    'is_listed',
                    Submit('submit', 'Submit')
        )


class ServiceCategoryForm(forms.ModelForm, BootstrapMixin):
    class Meta:
        fields = "__all__"
        model = models.ServiceCategory


class ServicePersonForm(forms.ModelForm, BootstrapMixin):
    class Meta:
        exclude = "active",
        model = models.ServicePerson

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.add_input(Submit('submit', 'Submit'))


class ServicePersonUpdateForm(forms.ModelForm, BootstrapMixin):
    class Meta:
        exclude = "employee", 'active',
        model = models.ServicePerson


class ServiceTeamForm(forms.ModelForm, BootstrapMixin):
    # create members in react
    class Meta:
        exclude = "members",
        model = models.ServiceTeam
        widgets = {
            "description": forms.Textarea(attrs={"rows": 4})
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.layout = Layout(
            Row(
                Column(
                    'Team Creation Form',
                    'name',
                    'description',
                    'manager',
                    css_class="col-md-6 col-sm-12"),
                Column(
                    HTML(
                        """
                            <p>Select Service People:</p>
                            <div><div id="personnel-list"></div>
                            """
                    ), css_class="col-md-6 col-sm-12")
            )
        )
        self.helper.add_input(Submit('submit', 'Submit'))


class ServiceWorkOrderForm(forms.ModelForm, BootstrapMixin):
    # create service people in react
    status = forms.CharField(widget=forms.HiddenInput)
    works_request = forms.ModelChoiceField(
        models.WorkOrderRequest.objects.all(),
        widget=forms.HiddenInput)

    class Meta:
        fields = ['date', 'time', 'expected_duration',
                  'team', 'status', 'description', 'works_request']
        model = models.ServiceWorkOrder
        widgets = {
            'description': forms.Textarea(attrs={'rows': 4})
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.layout = Layout(
            
                    Row(
                        Column('date', css_class="form group col-md-6 col-sm-12"),
                        Column('time', css_class="form group col-md-6 col-sm-12"),
                    ),
                    'works_request',
                    'description',
                    'completed',
                    'expected_duration',
                    'status',
                    'authorized_by',
                    'team',
                    HTML('''<hr>
                    <h5>Service Team</h5>'''),
                    HTML(
                        """
                        <div id="work-order-persons"></div>      
                        """)
        )
        self.helper.add_input(Submit('submit', 'Submit'))


class ServiceWorkOrderCompleteForm(forms.ModelForm, BootstrapMixin):
    service_time = forms.CharField(widget=forms.HiddenInput, required=False)

    class Meta:
        fields = 'date', 'service_time'
        model = models.ServiceWorkOrder


class ServiceWorkOrderAuthorizationForm(BootstrapMixin, forms.Form):
    '''Authorization handled in the functional view work_order_authorize'''

    authorized_by = forms.ModelChoiceField(
        Employee.objects.filter(serviceperson__isnull=False))
    password = forms.CharField(widget=forms.PasswordInput)
    status = forms.ChoiceField(choices=models.ServiceWorkOrder.STATUS_CHOICES)

    def clean(self, *args, **kwargs):
        cleaned_data = super().clean(*args, **kwargs)
        password = cleaned_data['password']
        employee = cleaned_data['authorized_by']

        if not authenticate(username=employee.user.username, password=password):
            raise forms.ValidationError('The password supplied is incorrect.')

        return cleaned_data


class EquipmentRequisitionForm(forms.ModelForm, BootstrapMixin):
    equipment = forms.CharField(widget=forms.HiddenInput)

    class Meta:
        exclude = "authorized_by", "released_by", 'received_by', 'returned_date'
        model = models.EquipmentRequisition
        widgets = {
            'work_order': Select2Widget(attrs={'data-width': '20rem'})
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.helper = FormHelper()
        self.helper.layout = Layout(
            Row(
                Column('date', 'equipment', css_class="col-sm-6"),
                Column('work_order', css_class="col-sm-6"), css_class="form-row"),
            Row(
                Column('department', css_class="col-sm-6"),
                Column('warehouse', css_class="col-sm-6"),
                css_class="form-row"),
            Row(
                Column('reference', css_class="col-sm-6"),
                Column('requested_by', css_class="col-sm-6"), css_class="form-row"),
            HTML("""<div id='equipment-requisition-table'></div> """)

        )
        self.helper.add_input(Submit('submit', 'Submit'))


class WorkOrderEquipmentRequisitionForm(forms.ModelForm, BootstrapMixin):
    work_order = forms.ModelChoiceField(models.ServiceWorkOrder.objects.all(),
                                        widget=forms.HiddenInput)
    equipment = forms.CharField(widget=forms.HiddenInput)

    class Meta:
        exclude = "authorized_by", "released_by", 'received_by', 'returned_date'
        model = models.EquipmentRequisition

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.helper = FormHelper()
        self.helper.layout = Layout(
            Row(
                Column('work_order', 'equipment', css_class="col-sm-12"), css_class="form-row"),
            Row(
                Column('date', css_class="col-sm-6"),
                Column('requested_by', css_class="col-sm-6"), css_class="form-row"),
            Row(
                Column('department', css_class="col-sm-6"),
                Column('warehouse', css_class="col-sm-6"),
                css_class="form-row"),
            Row(
                Column('reference', css_class="col-sm-12"),
                css_class="form-row"),
            HTML("""<div id='equipment-requisition-table'></div> """)

        )
        self.helper.add_input(Submit('submit', 'Submit'))


class ConsumablesRequisitionForm(forms.ModelForm, BootstrapMixin):
    consumables = forms.CharField(widget=forms.HiddenInput)

    class Meta:
        exclude = "authorized_by", "released_by",
        model = models.ConsumablesRequisition
        widgets = {
            'work_order': Select2Widget(attrs={'data-width': '20rem'})
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.helper = FormHelper()
        self.helper.layout = Layout(
            Row(
                Column('date', 'consumables', css_class="col-sm-6"),
                Column('work_order', css_class="col-sm-6"), css_class="form-row"),
            Row(
                Column('department', css_class="col-sm-6"),
                Column('warehouse', css_class="col-sm-6"),
                css_class="form-row"),
            Row(
                Column('reference', css_class="col-sm-6"),
                Column('requested_by', css_class="col-sm-6"), css_class="form-row"),
            HTML("""<div id='consumable-requisition-table'></div> """)

        )
        self.helper.add_input(Submit('submit', 'Submit'))


class WorkOrderConsumablesRequisitionForm(forms.ModelForm, BootstrapMixin):
    work_order = forms.ModelChoiceField(models.ServiceWorkOrder.objects.all(),
                                        widget=forms.HiddenInput)
    consumables = forms.CharField(widget=forms.HiddenInput)

    class Meta:
        exclude = "authorized_by", "released_by",
        model = models.ConsumablesRequisition

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.helper = FormHelper()
        self.helper.layout = Layout(
            Row(
                Column('work_order', 'consumables', css_class="col-sm-12"), css_class="form-row"),
            Row(
                Column('date', css_class="col-sm-6"),
                Column('requested_by', css_class="col-sm-6"), css_class="form-row"),
            Row(
                Column('department', css_class="col-sm-6"),
                Column('warehouse', css_class="col-sm-6"),
                css_class="form-row"),
            Row(
                Column('reference', css_class="col-sm-12"),
                css_class="form-row"),
            HTML("""<div id='consumable-requisition-table'></div> """)
        )
        self.helper.add_input(Submit('submit', 'Submit'))


class ServiceProcedureForm(forms.ModelForm, BootstrapMixin):
    class Meta:
        exclude = "required_equipment", "required_consumables"
        model = models.ServiceProcedure

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.layout = Layout(
                    'name',
                    'reference',
                    'author',
                    'description',
                    HTML('''<hr>
                    <h5>Procedure Steps</h5>'''),
                    HTML(
                        """
                        <div id="procedure-widgets" style="display:block;clear:both">
                        </div>
                        """
                    ),
                    HTML('''<hr>
                    <h5>Equipment and Consumables</h5>'''),
                    HTML("""
                        <div id="inventory-widgets" style="display:block;clear:both"></div>
                        """)
            )
        self.helper.add_input(Submit('submit', 'Submit'))


class EquipmentReturnForm(BootstrapMixin, forms.Form):
    received_by = forms.ModelChoiceField(
        Employee.objects.filter(inventorycontroller__isnull=False))
    return_date = forms.DateField()
    requisition = forms.ModelChoiceField(
        models.EquipmentRequisition.objects.all(), widget=forms.HiddenInput)

    def clean(self):
        cleaned_data = super().clean()
        receiver = cleaned_data['received_by']
        if not receiver.user.is_superuser and \
                not receiver.inventorycontroller.can_authorize_equipment_requisitions:

            raise forms.ValidationError(
                f'{receiver} cannot receive the requested items')

        requisition = cleaned_data['requisition']
        requisition.received_by = cleaned_data['received_by']
        requisition.returned_date = cleaned_data['return_date']
        requisition.save()
        return cleaned_data


class WorkOrderRequestForm(BootstrapMixin, forms.ModelForm):
    class Meta:
        fields = 'created', 'created_by', 'description', 'service', 'status'
        model = models.WorkOrderRequest
        widgets = {
            'description': forms.Textarea(attrs={'rows': 4})
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.layout = Layout(
            'created', 
            'created_by', 
            'description', 
            'service', 
            'status'
        )
        self.helper.add_input(Submit('submit', 'Submit'))