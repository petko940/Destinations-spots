from django.urls import path

from apps.feedback.views import DestinationRating

urlpatterns = [
    path('api/destination/<int:destination_id>/rating', DestinationRating.as_view(), name='destination-rating'),
]
