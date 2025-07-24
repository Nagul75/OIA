# report/urls.py
from django.urls import path
from .views import create_company, list_companies

urlpatterns = [
    path('company/', create_company, name='create-company'),
    path('list-company/', list_companies, name='company-list'),
]
