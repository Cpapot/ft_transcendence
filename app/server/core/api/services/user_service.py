from django.contrib.auth.hashers import make_password

from ..models import User
from ..logger import Console

class UserService:

	@staticmethod
	def get(filter_column, filter_value):
		return User.objects.filter(**{filter_column: filter_value})

	@staticmethod
	def get_first(filter_column, filter_value):
		return User.objects.filter(**{filter_column: filter_value}).first()

	@staticmethod
	def get_value(filter_column, filter_value, target_column):
		return User.objects.filter(**{filter_column: filter_value}).values_list(target_column, flat=True).first()

	@staticmethod
	def create(options):
		Console.success(f"Creating user: {options['username']}")
		return User.objects.create(
			username=options['username'],
			email=options['email'],
			password=make_password(options.get('password', '')),
			avatar=options.get('avatar', 'https://opendata.okfn.de/user_avatar.png')
		)

	@staticmethod
	def change_password(email, new_password):
		user = User.objects.filter(email=email).first()
		if not user:
			Console.error(f"User {email} does not exist")
			return
	
		Console.info(f"Changing password for user: {email}")
		user.password = make_password(new_password)
		user.save()
		Console.success(f"Password changed for user: {email}")

	@staticmethod
	def exists(filter_column, filter_value):
		query = User.objects.filter(**{filter_column: filter_value})
		if not query:
			Console.error(f"{filter_column} {filter_value} does not exist")
			return False
		Console.info(f"{filter_column} {filter_value} exists")
		return True

	@staticmethod
	def delete(username):
		user = User.objects.filter(username=username).first()
		if user:
			user.delete()
			Console.info(f"User {username} deleted")
			return True
		Console.error(f"User {username} does not exist")
		return False

