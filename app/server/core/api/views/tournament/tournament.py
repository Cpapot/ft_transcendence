import random

from rest_framework import permissions
from .tournament_utils import getUniqueTournamentId
from ..game.game import game
from ...services.user_service import UserService
from ...logger import Console

class tournamentPlayer():
	def __init__(self, login):
		self.login = login
		self.disconnected = False
		self.socketConnection = False
		self.seed = 0
		self.avatar = UserService.get_value('username', self.login, 'avatar')

	def getLogin(self):
		return self.login

	def setSeed(self, seed):
		self.seed = seed


class tournament():
	prermisson_classes = [permissions.AllowAny]

	def __init__(self, name, login):
		self.isInGamePhase = False
		self.tournamentName = name
		self.isFull = False
		self.tournamentID = getUniqueTournamentId()
		self.playerArray = []
		self.playerCount = 0
		self.playerCountOnSocket = 0
		self.gameArray = []
		self.tournamentPhase = 0
		self.addPlayer(login)
		Console.info("new tournament named: \"" + name + "\" has been created by: \"" + login + "\" with id: \"" + self.tournamentID + "\"")


	def setPlayerSeed(self):
		tmpArray = [None, None, None, None, None, None, None, None]
		if (self.isFull == False):
			return False
		for i in range(len(self.playerArray)):
			while True:
				pos = random.randint(0, 7)
				if (tmpArray[pos] == None):
					break
			tmpArray[pos] = self.playerArray[i]
			tmpArray[pos].seed = pos
		self.playerArray = tmpArray
		return True

	def LauchGame(self):
		if (self.tournamentPhase == 0):
			#game 1
			self.gameArray.append(game('1v1', self.playerArray[0].login))
			self.gameArray[0].addPlayer(self.playerArray[1].login)
			#game 2
			self.gameArray.append(game('1v1', self.playerArray[2].login))
			self.gameArray[1].addPlayer(self.playerArray[3].login)
			#game 3
			self.gameArray.append(game('1v1', self.playerArray[4].login))
			self.gameArray[2].addPlayer(self.playerArray[5].login)
			#game 4
			self.gameArray.append(game('1v1', self.playerArray[6].login))
			self.gameArray[3].addPlayer(self.playerArray[7].login)
		if (self.tournamentPhase == 1):
			#game 1
			self.gameArray.append(game('1v1', self.playerArray[0].login))
			self.gameArray[0].addPlayer(self.playerArray[1].login)
			#game 2
			self.gameArray.append(game('1v1', self.playerArray[2].login))
			self.gameArray[1].addPlayer(self.playerArray[3].login)
		if (self.tournamentPhase == 2):
			#game 1
			self.gameArray.append(game('1v1', self.playerArray[0].login))
			self.gameArray[0].addPlayer(self.playerArray[1].login)

	def connectOnSocket(self, login):
		if (self.playerCountOnSocket == 8):
			return 0
		if (self.isInTournament(login) == False):
			return 0
		for player in self.playerArray:
			if (player.login == login):
				if (player.socketConnection != True):
					player.socketConnection = True
					self.playerCountOnSocket = self.playerCountOnSocket + 1
					if (self.playerCountOnSocket == 8):
						return 2
					else:
						return 1
				else:
					return 0

	def disconnectedPlayerCount(self):
		result = 0
		for i in range(len(self.playerArray)):
			if(self.playerArray[i].disconnected == True):
				result = result + 1
		return result

	def isInTournament(self, login):
		for i in range(len(self.playerArray)):
			if (self.playerArray[i].login == login):
				return True
		return False

	def addPlayer(self, login):
		if (self.isFull):
			return False
		self.playerArray.append(tournamentPlayer(login))
		Console.info("player: \"" + login + "\" has joined the tournament with id: \"" + self.tournamentID + "\"	(" + str(self.playerCount) + "/8)")
		self.playerCount = self.playerCount + 1
		if (self.playerCount == 8):
			self.isFull = True
			self.setPlayerSeed()
		return True

	def isWinner(self, login):
		for game in self.gameArray:
			if (game.winner == login):
				return True
		return False

	def deletePlayer(self, login):
		for i in range(len(self.playerArray)):
			if (self.playerArray[i].login == login):
				if (self.playerArray[i].socketConnection == True):
					self.playerArray[i].socketConnection ==  False
					self.playerCountOnSocket = self.playerCountOnSocket - 1
				self.playerArray.pop(i)
				self.playerCount = self.playerCount - 1
				break

	def removeLooser(self):
		looserIndex = []
		for i in range(len(self.playerArray)):
			if (self.isWinner(self.playerArray[i].login) == False):
				looserIndex.append(i)
		for i in range(len(looserIndex)):
			Console.info(self.playerArray[looserIndex[i] - i].login + ' has been successfully withdrawn from the tournament')
			self.playerArray.pop(looserIndex[i] - i)

	def isFull(self):
		return self.isFull

	def getId(self):
		return self.tournamentID
