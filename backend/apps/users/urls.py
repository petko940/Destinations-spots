from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from apps.users.views import RegisterAPIView, MyTokenObtainPairView, ChangeUsernameView, GetUsernameByID, GetUserIDByUsername

urlpatterns = [
    path('api/register/', RegisterAPIView.as_view(), name='register'),
    path('api/login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token-refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('api/user/<int:pk>/', GetUsernameByID.as_view(), name='get-username'),
    path('api/user/<str:username>/', GetUserIDByUsername.as_view(), name='get-user-id'),

    path('api/user/<int:pk>/change-username/', ChangeUsernameView.as_view(), name='change-username'),
]
