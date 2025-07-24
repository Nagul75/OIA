# report/serializers.py
from rest_framework import serializers
from .models import Company

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id', 'company_name', 'output_excel']  # Exclude 'user' from input

    def create(self, validated_data):
        user = self.context['request'].user
        return Company.objects.create(user=user, **validated_data)
