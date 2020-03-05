from rest_framework import serializers
from django.contrib.auth.models import User
from common_data.models import GlobalConfig


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']


class ConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = GlobalConfig
        fields = "pos_supervisor_password",
