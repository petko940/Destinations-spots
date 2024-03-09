from django.urls import path

from apps.users.views import RegisterAPIView, LoginAPIView

urlpatterns = [
    path('api/register/', RegisterAPIView.as_view(), name='register'),
    path('api/login/', LoginAPIView.as_view(), name='login'),
]
