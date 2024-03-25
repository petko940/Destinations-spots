from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from apps.users.views import RegisterAPIView, MyTokenObtainPairView, ChangeUsernameView, GetUserName, GetUserID

urlpatterns = [
    path('api/register/', RegisterAPIView.as_view(), name='register'),
    path('api/login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token-refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('api/user/<int:pk>/', GetUserName.as_view(), name='get-username'),
    path('api/user/<str:username>/', GetUserID.as_view(), name='get-user-id'),

    path('api/user/<int:pk>/change-username/', ChangeUsernameView.as_view(), name='change-username'),
]
