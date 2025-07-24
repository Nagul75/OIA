from django.db import models
from django.conf import settings

class Company(models.Model):
    company_name = models.CharField(max_length=255)
    output_excel = models.BinaryField(null=True, blank=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='companies',
    )

    def __str__(self):
        return self.company_name
