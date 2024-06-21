from rest_framework import serializers

class UserEmailExist(serializers.Serializer):
	email = serializers.EmailField(max_length=100, required=False, allow_blank=True)
