import string, random
from django.core.cache import cache
from ...logger import Console

def getGameByID(gameID):
	game_instance = cache.get('game_instance', [])
	for i in range(len(game_instance)):
		if (game_instance[i].getGameID() == gameID):
			return game_instance[i]
	return None

def setGame(game):
	game_instance = cache.get('game_instance', [])
	gameID = game.gameID
	for i in range(len(game_instance)):
		if (game_instance[i].getGameID() == gameID):
			game_instance[i] = game
			cache.set('game_instance', game_instance)
			return
	Console.error("You cannot update the game: \"" + gameID + "\" in the cache because it does not exist")

def isInAGame(login):
	game_instance = cache.get('game_instance', [])
	for i in range(len(game_instance)):
		if (game_instance[i].isInGame(login)):
			return True
	return False

def deleteGame(gameID):
	game_instance = cache.get('game_instance', [])
	for i in range(len(game_instance)):
		if (game_instance[i].getGameID() == gameID):
			game_instance.pop(i)
			Console.info('game with ID \"' + gameID + '\" has been succesfully deleted')
			cache.set('game_instance', game_instance)
			break
		elif (i == len(game_instance) - 1):
			Console.error("You cannot delete the game: \"" + gameID + "\" in the cache because it does not exist")

def IsGameIdValid(gameID):
	game_instance = cache.get('game_instance', [])
	for i in range(len(game_instance)):
		if (game_instance[i].getGameID() == gameID):
			return True
	return False

def getUniqueGameId():
	game_instance = cache.get('game_instance', [])
	id = ''.join(random.choice(string.ascii_letters) for i in range(15))
	for i in range(len(game_instance)):
		if (game_instance[i].getGameID() == id):
			i = 0
			id = ''.join(random.choice(string.ascii_letters) for i in range(15))
	return id
