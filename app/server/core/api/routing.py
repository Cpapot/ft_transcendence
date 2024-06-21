from django.urls import re_path

from .consumers import (
    game,
    tournament,
    tournamentGame
)

websocket_urlpatterns = [
    re_path(r'ws/game/(?P<group_name>\w+)', game.GameConsumer.as_asgi()),
    re_path(r'ws/tournament/(?P<group_name>\w+)', tournament.TournamentConsumer.as_asgi()),
    re_path(r'ws/tournamentgame/(?P<group_name>\w+)', tournamentGame.TournamentGame.as_asgi())
]
