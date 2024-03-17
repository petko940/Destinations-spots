from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from apps.users.views import RegisterAPIView, MyTokenObtainPairView, ChangeUsernameView

urlpatterns = [
    path('api/register/', RegisterAPIView.as_view(), name='register'),
    path('api/login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token-refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('api/user/<int:pk>/change-username/', ChangeUsernameView.as_view(), name='change-username'),
]
