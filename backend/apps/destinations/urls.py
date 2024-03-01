from django.urls import path

from apps.destinations.views import CreateDestination, AllDestinations

urlpatterns = [
    path('api/create-destination/', CreateDestination.as_view(), name='create-destination'),
    path('api/all-destinations/', AllDestinations.as_view(), name='all-destination'),
]
