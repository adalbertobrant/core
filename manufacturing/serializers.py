from rest_framework import serializers
from manufacturing import models





class ProcessMachineSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ProcessMachine
        fields = "__all__"


class ProcessProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ProcessProduct
        fields = "__all__"


class ProcessSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Process
        fields = "__all__"
