from django.urls import path

from apps.users.views import RegisterAPIView, LoginAPIView, MyTokenObtainPairView

urlpatterns = [
    path('api/register/', RegisterAPIView.as_view(), name='register'),
    path('api/login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),

]
