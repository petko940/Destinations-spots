from rest_framework import serializers

from apps.destinations.models import Destination
from apps.feedback.serializer import RatingSerializer


class DestinationSerializer(serializers.ModelSerializer):
    rating = RatingSerializer(many=True, read_only=True)

    class Meta:
        model = Destination
        fields = '__all__'
