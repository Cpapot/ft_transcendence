from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    avatar = models.CharField(max_length=255, blank=True, null=True)
    totp_secret = models.CharField(max_length=255, blank=True, null=True)
    totp_verified = models.BooleanField(default=False)

    first_name = None
    last_name = None
    last_login = None

class UserHistory(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    ip_address = models.CharField(max_length=100)
    login_time = models.DateTimeField(auto_now_add=True)
