from django.shortcuts import render
from rest_framework import generics

from apps.users.serializers import RegisterSerializer


# Create your views here.
class RegisterAPIView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

