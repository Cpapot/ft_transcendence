from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from ...logger import Console
from django.core.cache import cache
from ...serializers.tournament import CreateTournament, JoinTournament
from ...serializers.empty import EmptySerializer
from .tournament_utils import getTournamentByID, setTournament

from .tournament import tournament
from .tournament_utils import isInATounament

class CreateTournament(APIView):
	permission_classes = [permissions.IsAuthenticated]
	serializer_class = CreateTournament

	def post(self, request):
		serializer = self.serializer_class(data=request.data)
		if serializer.is_valid():
			name = serializer.validated_data.get('name')
		else:
			return Response({'response': 'invalid_data'}, status=status.HTTP_400_BAD_REQUEST)
		tournament_instance = cache.get('tournament_array', [])
		login = request.user.username
		if (isInATounament(login)):
			return Response({'response': 'already_tournament'}, status=status.HTTP_400_BAD_REQUEST)
		for tournament_i in tournament_instance:
			if (tournament_i.tournamentName == name):
				return Response({'response': 'name_already_use'}, status=status.HTTP_400_BAD_REQUEST)
		tournament_instance.append(tournament(name, login))
		cache.set('tournament_array', tournament_instance)
		return Response({'TournamentID': tournament_instance[len(tournament_instance) - 1].tournamentID}, status=status.HTTP_200_OK)

class GetAllTournament(APIView):
	permission_classes = [permissions.IsAuthenticated]
	serializer_class = EmptySerializer

	def get(self, request):
		tournament_instance = cache.get('tournament_array', [])
		serialized_data = []
		for tournament_i in tournament_instance:
			if (tournament_i.isFull == False):
				serialized_data.append({
					'name': tournament_i.tournamentName,
					'tournamentID': tournament_i.tournamentID,
					'playerCount': tournament_i.playerCount,
				})
		return Response(serialized_data, status=status.HTTP_200_OK)


class JoinTournament(APIView):
	permission_classes = [permissions.IsAuthenticated]
	serializer_class = JoinTournament

	def post(self, request):
		serializer = self.serializer_class(data=request.data)
		if serializer.is_valid():
			TournamentID = serializer.validated_data.get('TournamentID')
		else:
			return Response({'response': 'invalid_data'}, status=status.HTTP_400_BAD_REQUEST)
		login = request.user.username
		tournament_instance = getTournamentByID(TournamentID)
		if (isInATounament(login)):
			return Response({'response': 'already_tournament'}, status=status.HTTP_400_BAD_REQUEST)
		if tournament_instance is None:
			return Response({'response': 'id_not_found'}, status=status.HTTP_400_BAD_REQUEST)
		if (tournament_instance.isFull):
			return Response({'response': 'tournament_full'}, status=status.HTTP_400_BAD_REQUEST)
		else:
			tournament_instance.addPlayer(login)
			setTournament(tournament_instance)
			return Response({'TournamentID': tournament_instance.getId()}, status=status.HTTP_200_OK)


