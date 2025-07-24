# report/serializers.py

from rest_framework import serializers
from .models import Company

class BinaryField(serializers.Field):
    def to_representation(self, value):
        return None  # Hide binary in output (or return base64 if needed)

    def to_internal_value(self, data):
        if isinstance(data, bytes):
            return data
        raise serializers.ValidationError("Invalid binary content.")

class CompanySerializer(serializers.ModelSerializer):
    output_excel = BinaryField(required=False)

    class Meta:
        model = Company
        fields = ['id', 'company_name', 'output_excel']

    def create(self, validated_data):
        user = self.context['request'].user
        return Company.objects.create(user=user, **validated_data)
