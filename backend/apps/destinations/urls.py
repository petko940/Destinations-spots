from django.urls import path

from apps.destinations.views import CreateDestination, AllDestinations, DetailDestination, DeleteDestination, \
    EditDestination

urlpatterns = [
    path('api/create-destination/', CreateDestination.as_view(), name='create-destination'),
    path('api/all-destinations/', AllDestinations.as_view(), name='all-destination'),
    path('api/destination/<int:pk>/', DetailDestination.as_view(), name='detail-destination'),
    path('api/edit-destination/<int:pk>/', EditDestination.as_view(), name='edit-destination'),
    path('api/delete-destination/<int:pk>/', DeleteDestination.as_view(), name='delete-destination'),
]
