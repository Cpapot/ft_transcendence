from rest_framework.views import APIView
import time

BALLSIZE = 0.1
BALLSPEED = 6
PLAYERXSIZE = 0.7
PLAYERYSIZE = 1.8
MAXY = 3.5 - BALLSIZE
MINY = -3.5 + BALLSIZE
MAXX = 11
MINX = 11

class ball(APIView):
	previousTime = 0
	xPos = 0
	yPos = 0
	xVec = 1
	yVec = 0

	def getDeltaTime(self):
		currentTime = time.time()
		if (self.previousTime == 0):
			self.previousTime = currentTime
		delta = (currentTime - self.previousTime)
		self.previousTime = currentTime
		return delta

	def computeBall(self, playerArray):
		speedPerSecond = BALLSPEED * self.getDeltaTime()
		self.xPos += self.xVec * speedPerSecond
		self.yPos += self.yVec * speedPerSecond

		if (self.yPos > MAXY):
			self.yPos = MAXY
			self.yVec = -abs(self.yVec)
		elif(self.yPos < MINY):
			self.yPos = MINY
			self.yVec = abs(self.yVec)

		for i in range(len(playerArray)):
			if (self.xPos + BALLSIZE >= playerArray[i].x - PLAYERXSIZE / 2 and
				self.xPos - BALLSIZE <= playerArray[i].x + PLAYERXSIZE / 2 and
				self.yPos + BALLSIZE >= playerArray[i].y - PLAYERYSIZE / 2 and
				self.yPos - BALLSIZE <= playerArray[i].y + PLAYERYSIZE / 2):

				self.xVec = -self.xVec
				self.yVec = ((self.yPos - playerArray[i].y) / (PLAYERYSIZE / 2)) * 1.5

		if (self.xPos < -9.1 + 0.9):
			playerArray[0].score += 1
			self.xPos = 0
			self.yPos = 0
			self.xVec = 1
			self.yVec = 0
		if (self.xPos > 9.1 - 0.9):
			playerArray[1].score += 1
			self.xPos = 0
			self.yPos = 0
			self.xVec = -1
			self.yVec = 0
