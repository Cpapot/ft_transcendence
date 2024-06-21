import json
import asyncio
from ..logger import Console
from channels.generic.websocket import AsyncWebsocketConsumer
from ..views.game.game_utils import IsGameIdValid, setGame, getGameByID, deleteGame

class GameConsumer(AsyncWebsocketConsumer):

	async def connect(self):
		try:
			self.group_name = self.scope['url_route']['kwargs']['group_name']
			self.login = self.scope['username']
		except IndexError:
			return
		self.send_task = None
		if (IsGameIdValid(self.group_name)):
			await self.accept()
			GameInstance = getGameByID(self.group_name)
			match GameInstance.connectOnSocket(self.login):
				case 0:
					await self.send("false")
					await self.close()
				case 1:
					await self.channel_layer.group_add(self.group_name, self.channel_name)
					await self.send("true")
				case 2:
					await self.channel_layer.group_add(self.group_name, self.channel_name)
					await self.send("true")
					await self.channel_layer.group_send(self.group_name,
						{
							'type': 'send_opponent_login',
							'player1': GameInstance.playerArray[0].login,
							'player2': GameInstance.playerArray[1].login,
							'actualplayer': self.login,
							})
					setGame(GameInstance)
					self.send_task = asyncio.create_task(self.startGame())
			setGame(GameInstance)
		else:
			await self.accept()
			await self.send("false")
			await self.close()



	async def disconnect(self, close_code):
		if self.send_task is not None:
			self.send_task.cancel()
			try:
				await self.send_task
			except asyncio.CancelledError:
				pass
		await self.channel_layer.group_send(self.group_name,{'type': 'gameDisconnect'})
		GameInstance = getGameByID(self.group_name)
		if GameInstance is not None and GameInstance.finish != True:
			Console.info("the game with ID: \"" + self.group_name + "\" is over because \"" + self.login + "\" disconnected")
		deleteGame(self.group_name)
		await self.channel_layer.group_discard(
			self.group_name,
			self.channel_name
		)


	async def receive(self, text_data):
		try:
			data = json.loads(text_data)
			playerPos = data.get('playerY')
			if playerPos is None:
				raise ValueError("playerY is missing from the data")
			GameInstance = getGameByID(self.group_name)
			if (len(GameInstance.playerArray) >= 2):
				if (self.login == GameInstance.playerArray[0].login):
					GameInstance.playerArray[0].y = float(playerPos)
				elif (len(GameInstance.playerArray) == 2):
					GameInstance.playerArray[1].y = float(playerPos)
				setGame(GameInstance)
		except json.JSONDecodeError:
			Console.error("Request failed on webSocket: Failed to decode JSON")
			await self.send(text_data=json.dumps({"error": "Invalid JSON format"}))
		except ValueError as ve:
			Console.error(f"Request failed on webSocket: Value error: {ve}")
			await self.send(text_data=json.dumps({"error": str(ve)}))
		except Exception as e:
			Console.error(f"Request failed on webSocket: An error occurred: {e}")
			await self.send(text_data=json.dumps({"error": "An unexpected error occurred"}))


	async def startGame(self):
		try:
			while True:
				GameInstance = getGameByID(self.group_name)
				if GameInstance is None:
					return
				GameInstance.updateInGameData()
				setGame(GameInstance)
				if (GameInstance.finish == True):
					break
				await self.channel_layer.group_send(
				self.group_name,
					{
						'type': 'gameData',
						'player1': GameInstance.playerArray[0].login,
						'player2': GameInstance.playerArray[1].login,
						'actualplayer': self.login,
						'ballX': GameInstance.GameBall.xPos,
						'ballY': GameInstance.GameBall.yPos,
						'player1Y': GameInstance.playerArray[0].y,
						'player2Y': GameInstance.playerArray[1].y,
						'score1': GameInstance.playerArray[0].score,
						'score2': GameInstance.playerArray[1].score
					}
				)
				await asyncio.sleep(1/30)
			Console.info("Game with ID: \"" + GameInstance.gameID + "\" (" + GameInstance.playerArray[0].login +
				":" + str(GameInstance.playerArray[0].score) + ", " + GameInstance.playerArray[1].login + ":" +
				str(GameInstance.playerArray[1].score) + ")")
			await self.channel_layer.group_send(self.group_name,
				{
					'type': 'gameFinish',
					'player1': GameInstance.playerArray[0].login,
					'player2': GameInstance.playerArray[1].login,
					'score1': GameInstance.playerArray[0].score,
					'score2': GameInstance.playerArray[1].score
				})
			deleteGame(self.group_name)
		except asyncio.CancelledError:
			pass



#			message template



	async def gameData(self, event):
		player1 = event['player1']
		player2 = event['player2']
		actualplayer = event['actualplayer']
		ballXPos = event['ballX']
		ballYPos = event['ballY']
		player1Y = event['player1Y']
		player2Y = event['player2Y']
		player1Score = event['score1']
		player2Score = event['score2']
		if self.login == player1:
			await self.send(text_data=json.dumps({
				'opponentY' : player2Y,
				'ballX': ballXPos,
				'ballY': ballYPos,
				'leftScore': player2Score,
				'rightScore': player1Score
			}))
		else:
			await self.send(text_data=json.dumps({
				'opponentY' : player1Y,
				'ballX': ballXPos,
				'ballY': ballYPos,
				'leftScore': player2Score,
				'rightScore': player1Score,
			}))

	async def send_opponent_login(self, event):
		player1 = event['player1']
		player2 = event['player2']
		actualplayer = event['actualplayer']
		if self.login == player1:
			await self.send(text_data=json.dumps({
				'message' : "ready",
				'opponent': player2,
				'side': "right"
			}))
		else:
			await self.send(text_data=json.dumps({
				'message': "ready",
				'opponent': player1,
				'side': "left"
			}))

	async def gameDisconnect(self, event):
		await self.send(text_data=json.dumps({
			'message': 'game finish the other player disconnect'
		}))
		await self.close()

	async def gameFinish(self, event):
		player1Score = event['score1']
		player2Score = event['score2']
		player1 = event['player1']
		player2 = event['player2']
		if (player1Score > player2Score):
			await self.send(text_data=json.dumps({
				'message': 'gamefinish',
				'winner': player1
			}))
		else:
			await self.send(text_data=json.dumps({
				'message': 'gamefinish',
				'winner': player2
			}))
		await self.close()

