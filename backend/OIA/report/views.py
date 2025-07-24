import pandas as pd
import json
from collections import defaultdict
import numpy as np
from io import BytesIO
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import Company
from .serializer import CompanySerializer
import copy
import warnings

# --- Calculation Utilities ---

def parse_cmmi_rating(rating_str):
    try:
        return float(rating_str.split(" - ")[0])
    except (ValueError, AttributeError, IndexError, TypeError):
        return None

def calculate_and_append_final_summary(data):
    output_data = copy.deepcopy(data)

    for company, records in output_data.items():
        if not isinstance(records, list):
            continue

        subdomain_ratings = defaultdict(list)

        for record in records:
            subdomain = record.get("Sub Domain")
            rating = parse_cmmi_rating(record.get("CMMI Tier Observed Rating"))
            if subdomain and rating is not None:
                subdomain_ratings[subdomain].append(rating)

        subdomain_averages = {
            sd: round(sum(vals) / len(vals), 2)
            for sd, vals in subdomain_ratings.items()
        }

        overall_domain_score = round(
            sum(subdomain_averages.values()) / len(subdomain_averages), 2
        ) if subdomain_averages else None

        final_summary = {
            "final_calculation": {
                "subdomain_averages": subdomain_averages,
                "overall_domain_score": overall_domain_score
            }
        }

        records.append(final_summary)

    return output_data

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

            # Suppress openpyxl warnings if desired
            with warnings.catch_warnings():
                warnings.simplefilter("ignore")
                df = pd.read_excel(excel_io, sheet_name=0)

            df = df.replace({np.nan: None})
            df = df.dropna(how='all')

            json_data = df.to_dict(orient='records')
            result[company.company_name] = json_data
        except Exception as e:
            result[company.company_name] = {'error': f'Failed to parse Excel file: {str(e)}'}

    # ✅ Perform calculations and append results
    print("CALCULATING CMMI SCORES")
    final_result = calculate_and_append_final_summary(result)

    print("RETURNING JSON EXCEL RESPONSE")
    return Response(final_result, status=status.HTTP_200_OK)