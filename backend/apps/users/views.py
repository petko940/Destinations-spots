from django.contrib.auth import login
from django.shortcuts import render
from django.views.generic import TemplateView
from rest_framework import generics

from apps.users.serializers import RegisterSerializer


# Create your views here.
class RegisterAPIView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        login(self.request, user)
