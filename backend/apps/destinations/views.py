from django.shortcuts import render
from rest_framework import generics

from apps.destinations.models import Destination
from apps.destinations.serializers import DestinationSerializer


# Create your views here.
class CreateDestination(generics.CreateAPIView):
    queryset = Destination.objects.all()
    serializer_class = DestinationSerializer
