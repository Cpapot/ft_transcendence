from rest_framework_simplejwt.tokens import RefreshToken

class TokenService:
    @staticmethod
    def generate(user):
        token = RefreshToken.for_user(user)
        return {
            'refresh': str(token),
            'access': str(token.access_token)
        }