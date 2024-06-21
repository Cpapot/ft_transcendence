from rest_framework import serializers
from drf_spectacular.utils import extend_schema_field
import requests

class CreateTournament(serializers.Serializer):
	name = serializers.CharField(max_length=200)

class TournamentStatus(serializers.Serializer):
	TournamentID = serializers.CharField(max_length=200)

class JoinTournament(serializers.Serializer):
	TournamentID = serializers.CharField(max_length=200)
