# report/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Company
from .serializer import CompanySerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_company(request):
    file = request.FILES.get('output_excel')

    if not file:
        return Response({'error': 'No Excel file provided.'}, status=400)

    binary_data = file.read()  # Convert to binary

    data = {
        'company_name': request.POST.get('company_name'),
        'output_excel': binary_data
    }

    serializer = CompanySerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_companies(request):
    user = request.user
    if user.is_admin:
        companies = Company.objects.all()
    else:
        companies = Company.objects.filter(user=user)
    serializer = CompanySerializer(companies, many=True)
    return Response(serializer.data)
