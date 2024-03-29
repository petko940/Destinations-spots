from rest_framework import generics, status
from rest_framework.response import Response

from apps.destinations.models import Destination
from apps.destinations.serializers import DestinationSerializer


# Create your views here.
class CreateDestination(generics.CreateAPIView):
    serializer_class = DestinationSerializer

    def post(self, request, *args, **kwargs):
        name = request.data.get('name', None)
        description = request.data.get('description', None)
        location = request.data.get('location', None)
        user_id = request.data.get('user', None)

        if any([len(name) < 3, len(description) < 10, not location, 'Unknown' in location]):
            return Response({'error': 'Incomplete data provided'}, status=status.HTTP_400_BAD_REQUEST)

        if request.FILES.get('photo'):
            file_type = request.FILES['photo'].content_type.split('/')[0]
            if file_type != 'image':
                return Response({'error': 'Invalid file type'}, status=status.HTTP_400_BAD_REQUEST)

            max_size = 5 * 1024 * 1024
            if request.FILES['photo'].size > max_size:
                return Response({'error': 'Image size is too large'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user_id=user_id)
            return Response({'success': 'Destination saved successfully'}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AllDestinations(generics.ListAPIView):
    serializer_class = DestinationSerializer
    queryset = Destination.objects.all()


class DetailDestination(generics.RetrieveAPIView):
    serializer_class = DestinationSerializer
    queryset = Destination.objects.all()

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class EditDestination(generics.RetrieveUpdateAPIView):
    serializer_class = DestinationSerializer
    queryset = Destination.objects.all()

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def put(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': 'Destination updated successfully'}, status=status.HTTP_204_NO_CONTENT)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteDestination(generics.DestroyAPIView):
    serializer_class = DestinationSerializer
    queryset = Destination.objects.all()


class ThreeMostRecentCreatedDestinations(generics.ListAPIView):
    serializer_class = DestinationSerializer
    queryset = Destination.objects.order_by('-created_at')[:3]
