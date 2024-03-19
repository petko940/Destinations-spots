from django.contrib.auth import login, get_user_model
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

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


class GetUser(generics.RetrieveAPIView):
    serializer_class = UsernameSerializer
    queryset = User.objects.all()


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class ChangeUsernameView(generics.RetrieveUpdateAPIView):
    serializer_class = UsernameSerializer
    queryset = User.objects.all()

    def put(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(user, data=request.data)

        if serializer.is_valid():
            new_username = serializer.validated_data['username'].lower()
            serializer.validated_data['username'] = new_username
            serializer.save()

            access_token = AccessToken.for_user(user)
            refresh_token = RefreshToken.for_user(user)

            access_token.payload['username'] = new_username
            refresh_token.payload['username'] = new_username

            return Response({
                "access": str(access_token),
                "refresh": str(refresh_token),
                "user": {
                    "user_id": user.id,
                    "username": new_username,
                }
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
