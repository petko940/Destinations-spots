import jwt
from django.contrib.auth import login, authenticate, get_user_model
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework_simplejwt.models import TokenUser
from rest_framework_simplejwt.settings import api_settings
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from apps.users.serializers import RegisterSerializer, MyTokenObtainPairSerializer, UsernameSerializer

User = get_user_model()


# Create your views here.
class RegisterAPIView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

    def perform_create(self, serializer):
        if serializer.is_valid():
            username = serializer.validated_data['username'].lower()
            serializer.validated_data['username'] = username

            user = serializer.save()
            login(self.request, user)


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class ChangeUsernameView(generics.RetrieveUpdateAPIView):
    serializer_class = UsernameSerializer
    queryset = User.objects.all()

    def put(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(user, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
