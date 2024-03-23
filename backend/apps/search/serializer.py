from rest_framework import serializers

from apps.destinations.serializers import DestinationSerializer
from apps.users.serializers import UsernameSerializer


class CombinedSerializer(serializers.Serializer):
    users = UsernameSerializer(many=True)
    destinations = DestinationSerializer(many=True)

    def to_representation(self, instance):
        users_data = UsernameSerializer(instance['users'], many=True).data
        destinations_data = DestinationSerializer(instance['destinations'], many=True).data
        return {'users': users_data, 'destinations': destinations_data}
