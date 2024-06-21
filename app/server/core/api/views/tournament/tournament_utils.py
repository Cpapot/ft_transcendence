import string, random
from django.core.cache import cache
from ...logger import Console

def getTournamentGame(TournamentGameID):
	tournamentID = TournamentGameID[:15]
	gameID = TournamentGameID[15:]
	tournamentInstance = getTournamentByID(tournamentID)
	if tournamentInstance is None:
		return None
	for i in range(len(tournamentInstance.gameArray)):
		if (gameID == tournamentInstance.gameArray[i].gameID):
			return tournamentInstance.gameArray[i]
	return None

def setTournamentGame(TournamentGame, tournamentGameID):
	tournamentInstance = getTournamentByID(tournamentGameID[:15])
	for i in range(len(tournamentInstance.gameArray)):
		if (tournamentInstance.gameArray[i].gameID == TournamentGame.gameID):
			tournamentInstance.gameArray[i] = TournamentGame
			setTournament(tournamentInstance)
			return
	Console.error("You cannot update this tournament game in the cache because it does not exist")


def getTournamentByID(TournamentID):
	tournament_instance = cache.get('tournament_array', [])
	for i in range(len(tournament_instance)):
		if (TournamentID == tournament_instance[i].tournamentID):
			return tournament_instance[i]
	return None

def setTournament(tournament):
	tournament_instance = cache.get('tournament_array', [])
	TournamentID = tournament.tournamentID
	for i in range(len(tournament_instance)):
		if (TournamentID == tournament_instance[i].tournamentID):
			tournament_instance[i] = tournament
			cache.set('tournament_array', tournament_instance)
			return
	Console.error("You cannot update this tournament in the cache because it does not exist")

def isInATounament(login):
	tournament_instance = cache.get('tournament_array', [])
	for i in range(len(tournament_instance)):
		if (tournament_instance[i].isInTournament(login)):
			return True
	return False

def deleteTournament(TournamentID):
	tournament_instance = cache.get('tournament_array', [])
	for i in range(len(tournament_instance)):
		if (tournament_instance[i].getId() == TournamentID):
			del tournament_instance[i]
			cache.set('tournament_array', tournament_instance)
			Console.info('Tournament with ID: \"' + TournamentID + '\" succesfully deleted')
			break


def getUniqueTournamentId():
	tournament_instance = cache.get('tournament_array', [])
	id = ''.join(random.choice(string.ascii_letters) for i in range(15))
	for i in range(len(tournament_instance)):
		if (tournament_instance[i].getId() == id):
			i = 0
			id = ''.join(random.choice(string.ascii_letters) for i in range(15))
	return id
