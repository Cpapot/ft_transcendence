from rest_framework import serializers

class CustomTokenObtainPairSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=200, required=False, allow_blank=True)
    email = serializers.EmailField(max_length=100, required=False, allow_blank=True)
    password = serializers.CharField(max_length=256, required=False, allow_blank=True)

class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=100, required=True, allow_blank=False)

class ChangePasswordSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=200, required=True, allow_blank=False)
    new_password = serializers.CharField(max_length=256, required=True, allow_blank=False)
    confirm_new_password = serializers.CharField(max_length=256, required=True, allow_blank=False)