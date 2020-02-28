from rest_framework import serializers
from inventory.serializers import InventoryItemSerializer
from employees.serializers import EmployeeSerializer
from employees.models import Employee
from . import models


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        fields = "__all__"
        model = models.Service


class ServicePersonSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ["name", "id" ]
        model = models.ServicePerson

class ServiceTeamSerializer(serializers.ModelSerializer):
    members = ServicePersonSerializer(many=True)
    class Meta:
        fields = "__all__"
        model = models.ServiceTeam


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ['description']
        model = models.Task


class ProcedureSerializer(serializers.ModelSerializer):
    steps = TaskSerializer(many=True)
    required_equipment = InventoryItemSerializer(many=True)
    required_consumables = InventoryItemSerializer(many=True)

    class Meta:
        fields = ['required_equipment', 'required_consumables', 'steps']
        model = models.ServiceProcedure

class WorkOrderTaskSerializer(serializers.ModelSerializer):
    # assigned = EmployeeSerializer(many=False)
    class Meta:
        fields = "__all__"
        model = models.WorkOrderTask

class TimeLogSerializer(serializers.ModelSerializer):
    employee = serializers.SerializerMethodField()
    class Meta:
        fields = "__all__"
        model = models.TimeLog
    
    def get_employee(self, obj):
        return str(obj.employee)
    
class WorkOrderSerializer(serializers.ModelSerializer):
    service_people = ServicePersonSerializer(many=True)
    workordertask_set = WorkOrderTaskSerializer(many=True)
    timelog_set = TimeLogSerializer(many=True)
    class Meta:
        fields = ['service_people', 'id','workordertask_set', 'timelog_set']
        model = models.ServiceWorkOrder


