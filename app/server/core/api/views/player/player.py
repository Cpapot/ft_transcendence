from rest_framework.views import APIView

class player(APIView):

	def __init__(self, player, x, y):
		self.x = x
		self.y = y
		self.score = 0
		self.login = player
		self.socketConnection = False
		print(self.y)
