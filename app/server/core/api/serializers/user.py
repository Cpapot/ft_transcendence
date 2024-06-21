from rest_framework import serializers
from django.contrib.auth.hashers import check_password

from ..services.user_service import UserService

class UserSerializer(serializers.Serializer):
	email = serializers.EmailField(max_length=100, required=True, allow_blank=False)
	password = serializers.CharField(max_length=256, required=False, write_only=True)
	method = serializers.CharField(required=False)

	username = serializers.CharField(max_length=100, required=False, allow_blank=True)
	avatar = serializers.CharField(max_length=256, required=False, allow_blank=True)
	auth_method = serializers.CharField(required=False, allow_blank=True)

	def validate(self, attrs):
		user_name = attrs.get('username')
		user_email = attrs.get('email')
		user_password = attrs.get('password')
		user_method = attrs.get('method')
		auth_method = attrs.get('auth_method')

		user = UserService.get_first("email", user_email)

		if auth_method != 'intra':
			if not user_password:
				raise serializers.ValidationError({'message': 'password_required'})

			if user_method == 'register':
				if UserService.exists("email", user_email):
					raise serializers.ValidationError({'message': 'already_use_mail'})

				if UserService.exists("username", user_name):
					raise serializers.ValidationError({'message': 'already_use_login'})

			if user and user_method != 'register' and not check_password(user_password, user.password):
				raise serializers.ValidationError({'message': 'incorrect_password'})

		attrs['user'] = user
		return attrs

	def create(self, validated_data):
		user = validated_data.get('user')
		return (user and user) or UserService.create(validated_data)

	def save(self, **kwargs):
		return self.create(self.validated_data)