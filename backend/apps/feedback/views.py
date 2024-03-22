from django.db.models import Avg
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.destinations.models import Destination
from apps.feedback.models import Rating, Comment
from apps.feedback.serializer import RatingSerializer, CommentSerializer


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

        user_id = request.data['user']
        existing_rating = Rating.objects.filter(destination_id=destination_id, user_id=user_id).first()

        if existing_rating:
            serializer = self.get_serializer(existing_rating, data=request.data)
        else:
            serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class GetAllRatings(APIView):
    serializer_class = RatingSerializer
    lookup_field = 'destination_id'

    def get(self, request, *args, **kwargs):
        average_stars_per_destination = Rating.objects.values('destination_id').annotate(avg_stars=Avg('stars'))

        data = []

        for item in sorted(average_stars_per_destination, key=lambda x: x['avg_stars'], reverse=True):
            destination_id = item['destination_id']
            average_stars = item['avg_stars']
            data.append({'destination_id': destination_id, 'average_stars': average_stars})

        return Response(data[:3], status=status.HTTP_200_OK)


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


class DestinationComments(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    lookup_field = 'destination_id'

    def get_queryset(self, *args, **kwargs):
        destination_id = self.kwargs.get('destination_id')
        queryset = Comment.objects.filter(destination_id=destination_id)
        return queryset

    def post(self, request, *args, **kwargs):
        destination_id = self.kwargs.get('destination_id')
        destination = Destination.objects.get(id=destination_id)
        request.data['destination'] = destination.id

        serializer = self.get_serializer(data=request.data['payload'])
        if serializer.is_valid():
            serializer.save()
            return Response(request.data, status=status.HTTP_201_CREATED)

        return Response({'error': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)
