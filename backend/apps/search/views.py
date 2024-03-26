from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.destinations.models import Destination
from apps.search.serializer import CombinedSerializer

User = get_user_model()


# Create your views here.
class Search(APIView):
    def get(self, request):
        search_text = request.query_params.get('result')
        if search_text:
            user_queryset = User.objects.filter(username__icontains=search_text)
            destination_name_search = Destination.objects.filter(name__icontains=search_text)
            destination_description_search = Destination.objects.filter(description__icontains=search_text)
            destination_location_search = Destination.objects.filter(location__icontains=search_text)
            destination_queryset = (destination_name_search |
                                    destination_description_search |
                                    destination_location_search
                                    )

            serializer = CombinedSerializer(
                {'users': user_queryset,
                 'destinations': destination_queryset}
            )
            return Response(serializer.data)
        else:
            return Response({'users': [], 'destinations': []})
