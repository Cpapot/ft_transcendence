import requests
import os

from ...logger import Console

class IntraAPI:

	client_id = os.getenv('INTRA_API_CLIENT_ID')
	client_secret = os.getenv('INTRA_API_CLIENT_SECRET')

	def get_access_token(self, code):
		if code is None:
			Console.error('Code is missing')
			return None

		token_url = 'https://api.intra.42.fr/oauth/token'
		data = {
			'grant_type': 'authorization_code',
			'client_id': self.client_id,
			'client_secret': self.client_secret,
			'code': code,
			'redirect_uri': 'https://localhost:8080/oauth'
		}
		try:
			response = requests.post(token_url, data=data)
			response.raise_for_status()
			token_data = response.json()
			return token_data.get('access_token')
		except requests.exceptions.RequestException as e:
			Console.error('Request failed: ' + str(e))
			return None

	def get_user_info(self, token):
		url = 'https://api.intra.42.fr/v2/me'
		headers = {'Authorization': 'Bearer ' + token}

		try:
			response = requests.get(url, headers=headers)
			response.raise_for_status()
			data = response.json()
			user_info = {
				'username': data['login'],
				'email': data['email'],
				'avatar': data['image']['versions']['medium']
			}
			return user_info
		except requests.exceptions.RequestException as e:
			Console.error('Request failed: ' + str(e))
			return None

	def setup_token(self, code):
		token = self.get_access_token(code)
		if token is None:
			Console.error("Échec de l\'obtention du jeton")
			return None

		user_info = self.get_user_info(token)
		if user_info is None:
			Console.error("Échec de l\'obtention des informations utilisateur")
			return None

		return user_info
