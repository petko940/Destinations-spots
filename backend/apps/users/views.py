from django.contrib.auth import login, authenticate
from rest_framework import generics, status
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.users.serializers import RegisterSerializer


# Create your views here.
class RegisterAPIView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

    def perform_create(self, serializer):
        if serializer.is_valid():
            username = serializer.validated_data['username'].lower()
            serializer.validated_data['username'] = username

            user = serializer.save()
            login(self.request, user)


class LoginAPIView(APIView):
    def post(self, request):
        username = request.data.get('username').lower()
        password = request.data.get('password')
        user = authenticate(
            username=username,
            password=password
        )
        if user:
            login(request, user)
            token, _ = Token.objects.get_or_create(user=user)
            return Response({"token": token.key}, status=status.HTTP_200_OK)

        return Response({"error": "Wrong Credentials"}, status=status.HTTP_401_UNAUTHORIZED)
