from django import forms
from django.contrib.auth.models import User

from common_data.forms import BootstrapMixin

from . import models
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout, Submit, Row, Column, HTML, Div
from crispy_forms.bootstrap import TabHolder, Tab

class ConfigForm(forms.ModelForm, BootstrapMixin):
    class Meta:
        model = models.PlannerConfig
        fields = "number_of_agenda_items",

class EventForm(forms.ModelForm, BootstrapMixin):
    owner = forms.ModelChoiceField(
        User.objects.all(), 
        widget=forms.HiddenInput
        )
    json_participants = forms.CharField(
        widget=forms.HiddenInput
        )
    label  =forms.CharField(required=True)
    description  =forms.CharField(required=True, widget=forms.Textarea(attrs={'rows':4, 'cols':15}))
    class Meta:
        model = models.Event
        exclude = ["participants", 'completed', 'completion_time', 'reminder_notification']


    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.layout = Layout(
                    Row(
                        Column('date', css_class='form-group col-md-6 col-sm-12'),
                        Column(
                            Row(
                        Column('start_time', css_class='form-group col-md-6 col-sm-12'),
                        Column('end_time', css_class='form-group col-md-6 col-sm-12'),
                    ), css_class='form-group col-md-6 col-sm-12'),
                    ),
                    Row(
                        Column(
                            Row(
                        Column('label', 'reminder', css_class='form-group col-md-6 col-sm-12'),
                        Column('icon', 'priority', css_class='form-group col-md-6 col-sm-12'),
                    ),css_class='col-md-6 col-sm-12'),
                    Column('description' ,css_class='col-md-6 col-sm-12')
                    ),
                    Row(
                        Column( 'repeat','repeat_active',
                            css_class='form-group col-md-6 col-sm-12'),
                        Column(
                            HTML(
                                """
                                <p>Participants:</p>
                                <div id="participant-select">
                                </div>
                                """
                            ), css_class="form-group col-md-6 col-sm-12")
                    ),
                    
                    
                    'owner',
                    'json_participants',
                    Submit('submit', 'Submit')
                )
