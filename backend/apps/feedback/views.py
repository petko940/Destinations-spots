from rest_framework import generics, status
from rest_framework.response import Response

from apps.destinations.models import Destination
from apps.destinations.serializers import DestinationSerializer
from apps.feedback.models import Rating
from apps.feedback.serializer import RatingSerializer


# Create your views here.
class DestinationRating(generics.ListCreateAPIView):
    serializer_class = RatingSerializer
    lookup_field = 'destination_id'

    def get_queryset(self, *args, **kwargs):
        destination_id = self.kwargs.get('destination_id')
        queryset = Rating.objects.filter(destination_id=destination_id)
        return queryset

    def post(self, request, *args, **kwargs):
        destination_id = self.kwargs.get('destination_id')
        destination = Destination.objects.get(id=destination_id)
        request.data['destination'] = destination.id

        user_id = request.data['user']['id']
        request.data['user'] = user_id

        existing_rating = Rating.objects.filter(destination_id=destination_id, user_id=user_id).first()

        if existing_rating:
            serializer = self.get_serializer(existing_rating, data=request.data)
        else:
            serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class DeleteRating(generics.DestroyAPIView):
    serializer_class = RatingSerializer
    lookup_field = 'destination_id'

    def get_queryset(self, *args, **kwargs):
        destination_id = self.kwargs.get('destination_id')
        user_id = self.request.query_params.get('user')
        queryset = Rating.objects.filter(
            destination_id=destination_id,
            user_id=user_id)
        return queryset

    def delete(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if not queryset.exists():
            return Response("Rating not found for the user and destination.", status=status.HTTP_404_NOT_FOUND)

        rating_instance = queryset.first()
        rating_instance.delete()
        return Response("Rating deleted successfully.", status=status.HTTP_204_NO_CONTENT)
