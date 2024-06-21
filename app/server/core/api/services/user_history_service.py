from django.utils import timezone

from ..models import UserHistory

from .user_service import UserService
from ..logger import Console

class UserHistoryService:
    @staticmethod
    def connect(username, ip_address):
        user = UserService.get_first('username', username)
        if not user:
            Console.error(f"User {username} does not exist")
            return
        UserHistory.objects.update_or_create(
            user=user,
            defaults={
                'ip_address': ip_address,
                'login_time': timezone.now()
            }
        )
        Console.success(f"User logged in: {username} with IP: {ip_address}")
    
    @staticmethod
    def delete_inactive_users():
        inactivity_period = timezone.now() - timezone.timedelta(days=365 * 2)
        inactive_users = UserHistory.objects.filter(login_time__lt=inactivity_period)
        for user_history in inactive_users:
            user_history.user.delete()
            Console.success(f"User {user_history.user.username} deleted due to inactivity")
        return True