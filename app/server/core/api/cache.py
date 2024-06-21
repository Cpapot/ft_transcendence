from django.apps import AppConfig
from django.core.cache import cache

# Vide le cache Redis au démarrage du serveur
class MyAppConfig(AppConfig):
    name = 'api'

    def ready(self):
        cache.clear()
