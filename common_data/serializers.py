from rest_framework import serializers
from django.contrib.auth.models import User
from common_data.models import GlobalConfig, Individual, Organization


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']


class ConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = GlobalConfig
        fields = "pos_supervisor_password",


class BulkIndividualSerializer(serializers.ModelSerializer):
    def __init__(self, *args, **kwargs):
        print('called!!!!')
        super().__init__(many=True, *args, **kwargs)
    class Meta:
        model = Individual
        fields = '__all__'


class IndividualSerializer(serializers.ModelSerializer):
    class Meta:
        model = Individual
        fields = '__all__'


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = '__all__'