from rest_framework import serializers

class LauchGameSerializer(serializers.Serializer):
	gametype = serializers.CharField(max_length=200, required=True, allow_blank=False)

class IsGameStartedSerializer(serializers.Serializer):
	gameID = serializers.CharField(max_length=200)

class InGameSerializer(serializers.Serializer):
	gameID = serializers.CharField(max_length=200)
	PlayerY = serializers.FloatField()
	PlayerScore = serializers.IntegerField()
	OpponentScore = serializers.IntegerField()
