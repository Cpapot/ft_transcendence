from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from django.core.cache import cache
from ...serializers.game import (
    LauchGameSerializer
)

from ...logger import Console
from .game import game
from .game_utils import isInAGame

class LaunchGame(APIView):
	permission_classes = [permissions.IsAuthenticated]
	serializer_class = LauchGameSerializer

	def post(self, request):
		game_instance = cache.get('game_instance', [])
		serializer = self.serializer_class(data=request.data)
		if serializer.is_valid():
			gametype = serializer.validated_data.get('gametype')
		else:
			Console.error('Invalid data')
			return Response({'response': 'invalid_data'}, status=status.HTTP_400_BAD_REQUEST)
		login = request.user.username
		if (gametype != '1v1' and gametype != '2v2'):
			Console.error('Invalid game type')
			return Response({'response': 'invalid_game_type'}, status=status.HTTP_400_BAD_REQUEST)
		isInGame = False

		if (isInAGame(login)):
			Console.error('You are already in a game, finish it before starting a new one')
			return Response({'response': 'already_tournament'}, status=status.HTTP_400_BAD_REQUEST)
		for i in range(len(game_instance)):
			if (game_instance[i].getGameType() == gametype):
				if (game_instance[i].isFull() == False):
					game_instance[i].addPlayer(login)
					isInGame = True
					cache.set('game_instance', game_instance)
					break

		if (len(game_instance) == 0 or isInGame == False):
			game_instance.append(game(gametype, login))
			cache.set('game_instance', game_instance)
			return Response({'gameID': game_instance[len(game_instance) - 1].getGameID(), 'opponent': None}, status=status.HTTP_200_OK)
		cache.set('game_instance', game_instance)
		return Response({'gameID': game_instance[i].getGameID(), 'opponent': game_instance[i].getOtherPlayers(login)}, status=status.HTTP_200_OK)
