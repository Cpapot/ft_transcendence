
import os
import django

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'base.settings')
django.setup()

from api.routing import websocket_urlpatterns
from api.middleware.websocket_middleware import WebsocketMiddleware

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AllowedHostsOriginValidator(
        WebsocketMiddleware(
            URLRouter(
                websocket_urlpatterns
            )
        )
    ),
})