from django.contrib.auth import get_user_model
from django.db import models

UserModel = get_user_model()


# Create your models here.
class Destination(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField(max_length=500)
    photo = models.ImageField(upload_to='destinations/', blank=True, null=True)
    location = models.CharField(max_length=200)
    latitude = models.FloatField()
    longitude = models.FloatField()
    modified_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(
        to=UserModel,
        on_delete=models.CASCADE,
        editable=False
    )

    objects = models.Manager()
