from django.db import models


# Create your models here.
class Destination(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(max_length=500)
    photo = models.ImageField(upload_to='destinations/', blank=True, null=True)
    location = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()
