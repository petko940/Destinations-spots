from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


# Create your models here.
class Comment(models.Model):
    destination = models.ForeignKey('destinations.Destination', on_delete=models.CASCADE, related_name='comments')
    name = models.CharField(max_length=20)
    comment = models.TextField(max_length=200)

    objects = models.Manager()


class Rating(models.Model):
    destination = models.ForeignKey('destinations.Destination', on_delete=models.CASCADE, related_name='ratings')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    stars = models.IntegerField(default=0, choices=[(i, i) for i in range(1, 6)])

    objects = models.Manager()

    class Meta:
        unique_together = ('user', 'destination')
