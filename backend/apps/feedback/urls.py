from django.urls import path

from apps.feedback.views import DestinationRating, DeleteRating

urlpatterns = [
    path('api/destination/<int:destination_id>/rating', DestinationRating.as_view(), name='destination-rating'),
    path('api/destination/<int:destination_id>/rating/delete', DeleteRating.as_view(), name='delete-rating'),
]
