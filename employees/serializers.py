from rest_framework import serializers

from . import models


class EmployeeSerializer(serializers.ModelSerializer):
    logged_in = serializers.SerializerMethodField()
    login_time = serializers.SerializerMethodField()
    
    def get_logged_in(self, obj):
        return obj.logged_in

    def get_login_time(self, obj):
        return obj.login_time

    class Meta:
        model = models.Employee
        fields = '__all__'


class PayslipSerializer(serializers.ModelSerializer):
    gross = serializers.SerializerMethodField()
    deductions = serializers.SerializerMethodField()
    taxes = serializers.SerializerMethodField()
    employee = EmployeeSerializer(many=False)

    class Meta:
        model = models.Payslip
        fields = "__all__"

    def get_gross(self, obj):
        return obj.gross_pay

    def get_deductions(self, obj):
        return obj.non_tax_deductions

    def get_taxes(self, obj):
        return obj.total_payroll_taxes


class AttendanceLineSerializer(serializers.ModelSerializer):
    working_hours = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = models.AttendanceLine
        fields = '__all__'

    def get_working_hours(self, obj):
        return str(obj.working_time)


class TimeSheetSerializer(serializers.ModelSerializer):
    attendanceline_set = AttendanceLineSerializer(many=True)

    class Meta:
        model = models.EmployeeTimeSheet
        fields = '__all__'


class RecursiveField(serializers.Serializer):
    def to_representation(self, value):
        serializer = self.parent.parent.__class__(value, context=self.context)
        return serializer.data


class DepartmentSerializer(serializers.ModelSerializer):
    children = RecursiveField(many=True)

    class Meta:
        model = models.Department
        fields = "__all__"


class ShiftSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Shift
        fields = "__all__"

class ShiftScheduleLineSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = models.ShiftScheduleLine
        fields = "__all__"

class ShiftScheduleSerializer(serializers.ModelSerializer):
    shiftscheduleline_set = ShiftScheduleLineSerializer(many=True)
    class Meta:
        model = models.ShiftSchedule
        fields = "__all__"


class LeaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Leave
        fields = '__all__'