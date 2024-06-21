import json
import asyncio
from ..logger import Console
from channels.generic.websocket import AsyncWebsocketConsumer
from django.core.cache import cache
from ..views.tournament.tournament_utils import getTournamentByID, setTournament, deleteTournament

class TournamentConsumer(AsyncWebsocketConsumer):

	async def connect(self):
		try:
			self.group_name = self.scope['url_route']['kwargs']['group_name']
			self.login = self.scope['username']
		except IndexError:
			return
		tournamentInstance = getTournamentByID(self.group_name)
		if tournamentInstance is not None:
			await self.accept()
			match tournamentInstance.connectOnSocket(self.login):
				case 0:
					await self.send("false")
					await asyncio.sleep(1)
					await self.close()
				case 1:
					await self.channel_layer.group_add(self.group_name, self.channel_name)
					await self.send("true")
					await self.channel_layer.group_send(self.group_name,
						{'type': 'new_connection','player': self.login ,'playerArray': tournamentInstance.playerArray})
				case 2:
					await self.channel_layer.group_add(self.group_name, self.channel_name)
					await self.send("true")
					await self.channel_layer.group_send(self.group_name,
						{'type': 'new_connection','player': self.login ,'playerArray': tournamentInstance.playerArray})
					await self.channel_layer.group_send(self.group_name,
						{'type': 'send_tournament_member', 'playerArray': tournamentInstance.playerArray })
					tournamentInstance.LauchGame()
					setTournament(tournamentInstance)
					await self.channel_layer.group_send(self.group_name,
						{'type': 'send_tournament_game','gameArray': tournamentInstance.gameArray})
					self.send_task = asyncio.create_task(self.checkIfPhasefinish())
			setTournament(tournamentInstance)
		else:
			await self.accept()
			await self.send("false")
			await asyncio.sleep(1)
			await self.close()

	async def disconnect(self, close_code):
		Console.info("\"" + self.login + "\" has left the tournament with ID: \"" + self.group_name + "\"")
		tournamentInstance = getTournamentByID(self.group_name)
		if tournamentInstance is None:
			return
		if (tournamentInstance.isFull == False):
			await self.channel_layer.group_send(self.group_name, {'type': 'disconnection', 'player': self.login })
			tournamentInstance.deletePlayer(self.login)
			setTournament(tournamentInstance)
			if (tournamentInstance.playerCount == 0):
				deleteTournament(self.group_name)
				return
		for i in range(len(tournamentInstance.playerArray)):
			if (tournamentInstance.playerArray[i].login == self.login):
				tournamentInstance.playerArray[i].disconnected = True
				setTournament(tournamentInstance)

		if (tournamentInstance.isInGamePhase == False and tournamentInstance.disconnectedPlayerCount() >= 2):
			await self.channel_layer.group_send(self.group_name, {'type': 'finish_tournament'})
			deleteTournament(self.group_name)

		setTournament(tournamentInstance)

	async def receive(self, text_data):
		pass

	async def checkIfPhasefinish(self):
		tournamentInstance = getTournamentByID(self.group_name)
		tournamentInstance.isInGamePhase = True
		setTournament(tournamentInstance)
		while True:
			tournamentInstance = getTournamentByID(self.group_name)
			if (tournamentInstance.tournamentPhase == 0):
				if (tournamentInstance.gameArray[0].finish == True and tournamentInstance.gameArray[1].finish == True
					and tournamentInstance.gameArray[2].finish == True and tournamentInstance.gameArray[3].finish == True):
					break
			if (tournamentInstance.tournamentPhase == 1):
				if (tournamentInstance.gameArray[0].finish == True and tournamentInstance.gameArray[1].finish == True):
					break
			if (tournamentInstance.tournamentPhase == 2):
				if (tournamentInstance.gameArray[0].finish == True):
					break
			await asyncio.sleep(1/2)
		tournamentInstance.tournamentPhase = tournamentInstance.tournamentPhase + 1
		setTournament(tournamentInstance)
		await self.channel_layer.group_send(self.group_name,
		{
			'type': 'send_tournament_winners',
			'gameArray': tournamentInstance.gameArray,
			'phase': tournamentInstance.tournamentPhase
		})
		tournamentInstance = getTournamentByID(self.group_name)
		tournamentInstance.isInGamePhase = False
		tournamentInstance.removeLooser()
		tournamentInstance.gameArray.clear()
		setTournament(tournamentInstance)
		if (tournamentInstance.tournamentPhase < 3):
			await asyncio.sleep(10)
			tournamentInstance = getTournamentByID(self.group_name)
			tournamentInstance.LauchGame()
			setTournament(tournamentInstance)
			await self.channel_layer.group_send(self.group_name,
				{'type': 'send_tournament_game','gameArray': tournamentInstance.gameArray})
			self.send_task = asyncio.create_task(self.checkIfPhasefinish())
		else:
			deleteTournament(self.group_name)




#			message template




	async def send_tournament_winners(self, event):
		gameArray = event['gameArray']
		phase = event['phase']
		game_data = [{"gameID": uniquegame.gameID, "winner": uniquegame.winner} for uniquegame in gameArray]
		await self.send(text_data=json.dumps(game_data))
		if (phase == 3):
			self.close()

	async def send_tournament_game(self, event):
		gameArray = event['gameArray']
		game_data = [
			{
				"gameID": uniquegame.gameID,
				"player1": uniquegame.playerArray[0].login,
				"player2": uniquegame.playerArray[1].login
			} for uniquegame in gameArray
		]
		await self.send(text_data=json.dumps(game_data))

	async def new_connection(self, event):
		newPlayer = event['player']
		playerArray = event['playerArray']
		newPlayerAvatar = None
		for player in playerArray:
			if (player.getLogin() == newPlayer):
				newPlayerAvatar = player.avatar
		if (self.login != newPlayer):
			await self.send(text_data=json.dumps({"NewPlayer" : newPlayer, "avatar" : newPlayerAvatar}))
		else:
			players_data = [{"login": player.getLogin(), "avatar" : player.avatar } for player in playerArray]
			await self.send(text_data=json.dumps(players_data))

	async def disconnection(self, event):
		player = event['player']
		await self.send(text_data=json.dumps({"DisconnectedPlayer" : player}))


	async def send_tournament_member(self, event):
		playerArray = event['playerArray']
		players_data = [{"login": player.getLogin(), "seed": player.seed} for player in playerArray]
		await self.send(text_data=json.dumps(players_data))

	async def finish_tournament(self, event):
		await self.send(text_data=json.dumps({'finish': 'to much player disconnect'}))
		self.close()
