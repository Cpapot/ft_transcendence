from django.urls import path

from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenVerifyView
)
from drf_spectacular.views import (
    SpectacularAPIView, 
    SpectacularSwaggerView
)

from .views.auth.auth import CustomTokenObtainPairView
from .views.auth.auth_verify import AuthVerifyUserView
from .views.auth.password.reset_password import ForgotPasswordView
from .views.auth.password.change_password import ChangePasswordView

from .views.game.game_request import LaunchGame
from .views.tournament.tournament_request import (
    GetAllTournament, 
    CreateTournament, 
    JoinTournament
)
from .views.account.account_delete import AccountDeleteView
from .views.account.change_two_fa import ChangeTwoFAView
from .views.account.verify_two_fa import VerifyTwoFAView

urlpatterns = [
	# schema api
	path('', SpectacularSwaggerView.as_view(
        template_name="swagger-ui.html", url_name="schema"
    ), name="swagger-ui"),
	path("schema/", SpectacularAPIView.as_view(), name="schema"),

	# auth token management
	path('auth/user/', CustomTokenObtainPairView.as_view(), name='custom-token-obtain-pair'),
    path('auth/verify_user/', AuthVerifyUserView.as_view(), name='verify-user'),
	path('auth/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
	path('auth/verify/', TokenVerifyView.as_view(), name='token-verify'),
	path('auth/reset_password/', ForgotPasswordView.as_view(), name='forgot-password'),

	# account management
	path('account/change_password/', ChangePasswordView.as_view(), name='change-password'),
	path('account/change_two_fa/', ChangeTwoFAView.as_view(), name='active-two-fa'),
	path('account/verify_two_fa/', VerifyTwoFAView.as_view(), name='active-two-fa'),
    path('account/delete/', AccountDeleteView.as_view(), name='user-delete'),

	# game management
	path('game/', LaunchGame.as_view(), name='join-game'),

	# tournament management
	path('tournament/join/', JoinTournament.as_view(), name='join-tournament'),
	path('tournament/all/', GetAllTournament.as_view(), name='get-all-tournament'),
	path('tournament/create/', CreateTournament.as_view(), name='create-tournament'),
]
