import pandas as pd

import numpy as np
from io import BytesIO
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated,AllowAny
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

    # Wrap binary data in ContentFile
    content = file.read()
    binary_file = content if content else None
    print("Binary length:", len(binary_file) if binary_file else "Empty")

    data = {
        'company_name': request.POST.get('company_name'),
        'output_excel': binary_file  # Directly assign binary data
    }

    serializer = CompanySerializer(data=data, context={'request': request})
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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def company_excel_to_json(request):
    print("INSIDE TO JSON VIEW")
    user = request.user

    if user.is_admin:
        companies = Company.objects.all()
    else:
        if not hasattr(user, 'company'):
            return Response({'error': 'User is not assigned to any company.'}, status=status.HTTP_403_FORBIDDEN)
        companies = [user.company]

    result = {}

    for company in companies:
        print(f"Company: {company.company_name}, Excel present: {bool(company.output_excel)}")
        if not company.output_excel:
            result[company.company_name] = {'error': 'No Excel file stored.'}
            continue

        try:
            excel_io = BytesIO(company.output_excel)

            # Optional: confirm available sheets
            # xls = pd.ExcelFile(excel_io)
            # print("Sheets available:", xls.sheet_names)

            df = pd.read_excel(excel_io, sheet_name=0)  # adjust if needed
            df = df.replace({np.nan: None})  # Ensure JSON compatibility
            df = df.dropna(how='all')        # Remove empty rows

            json_data = df.to_dict(orient='records')
            result[company.company_name] = json_data
        except Exception as e:
            result[company.company_name] = {'error': f'Failed to parse Excel file: {str(e)}'}

    print("RETURNING JSON EXCEL RESPONSE")
    return Response(result, status=status.HTTP_200_OK)