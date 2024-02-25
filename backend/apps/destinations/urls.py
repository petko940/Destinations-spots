from django.urls import path

from apps.destinations.views import CreateDestination

urlpatterns = [
    path('api/create-destination/', CreateDestination.as_view(), name='create-destination'),
]
