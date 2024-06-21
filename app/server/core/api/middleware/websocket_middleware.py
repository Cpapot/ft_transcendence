from urllib.parse import parse_qs

from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken, TokenError
from ..services.user_service import UserService

@database_sync_to_async
def get_user(user_id):
    return UserService.get_value("id", user_id, "username") or AnonymousUser()
    
class WebsocketMiddleware:

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        parsed_query_string = parse_qs(scope["query_string"])
        token = parsed_query_string.get(b"token")[0].decode("utf-8")

        try:
            access_token = AccessToken(token)
            scope["username"] = await get_user(access_token["user_id"])
        except TokenError:
            scope["username"] = AnonymousUser()

        return await self.app(scope, receive, send)