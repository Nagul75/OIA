from django.urls import path
from .views import register_user, create_admin_user

urlpatterns = [
    path('register/', register_user, name='register'),
    path('create-admin/', create_admin_user, name='create-admin'),  # Only for staff
]
