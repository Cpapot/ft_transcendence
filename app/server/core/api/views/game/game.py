import time
from rest_framework.views import APIView
from ...logger import Console
from .game_utils import getUniqueGameId
from ..player.player import player
from .game_ball import ball

class game(APIView):
	gameID = None
	gameType = None
	playerArray = []
	full = False
	GameBall = None
	finish = False
	winner = None

	def __init__(self, gameType, login):
		self.playerArray = []
		self.gameID = getUniqueGameId()
		self.gameType = gameType
		self.playerArray.append(player(login, 7.9, -1.5))
		self.full = False
		Console.info("Game created with ID: \"" + self.gameID + "\" and type: " + self.gameType + " with player: \"" + self.playerArray[0].login + "\"")

	def addPlayer(self, login):
		self.playerArray.append(player(login, -7.9, 1.5))
		self.full = True
		Console.info("Game with ID: \"" + self.gameID + "\" is now full with player2: \"" + self.playerArray[1].login + "\"")

	def lauch(self):
		if (self.GameBall is None):
			self.GameBall = ball()

		self.GameBall.previousTime = time.time()

	def updateInGameData(self):
		if (self.GameBall is None):
			self.GameBall = ball()

		self.GameBall.computeBall(self.playerArray)

		if (self.playerArray[0].score == 5 or self.playerArray[1].score == 5):
			self.finish = True
			if (self.playerArray[0].score == 5):
				self.winner = self.playerArray[0].login
			else:
				self.winner = self.playerArray[1].login


	def connectOnSocket(self, login):
		if (self.playerArray[0].login == login):
			if (self.playerArray[0].socketConnection == True):
				return 0
			else:
				self.playerArray[0].socketConnection = True
				if (self.isAllOnSocket()):
					return 2
				else:
					return 1
		if (len(self.playerArray) > 1 and login == self.playerArray[1].login):
			if (self.playerArray[1].socketConnection == True):
				return 0
			else:
				self.playerArray[1].socketConnection = True
				if (self.isAllOnSocket()):
					return 2
				else:
					return 1

	def isAllOnSocket(self):
		if (self.playerArray[0].socketConnection == True and len(self.playerArray) > 1 and self.playerArray[1].socketConnection == True):
			return True
		return False


	def isInGame(self, login):
		if (login == self.playerArray[0].login):
			return True
		if (len(self.playerArray) > 1 and login == self.playerArray[1].login):
			return False
		return False

	def isFinish(self):
		return self.finish

	def isFull(self):
		return self.full

	def getGameType(self):
		return self.gameType

	def getGameID(self):
		return self.gameID

	def getOtherPlayers(self, login):
		if (login == self.playerArray[0].login):
			return self.playerArray[1].login
		elif (login == self.playerArray[1].login):
			return self.playerArray[0].login
		else:
			return None
