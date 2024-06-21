import pyotp
from rest_framework.views import APIView
from rest_framework import status, permissions
from drf_spectacular.utils import extend_schema
from rest_framework.response import Response

from ...globals.global_variables import in_double_auth
from ...services.user_service import UserService
from ...serializers.empty import EmptySerializer
from ...logger import Console

class VerifyTwoFAView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = EmptySerializer

    @extend_schema(
        description="Get two factor authentication status.",
        request=serializer_class,
        responses={200: {"description": "Two factor authentication status retrieved successfully"}}
    )

    def get(self, request):
        user = request.user
        return Response({'two_fa_status': user.totp_verified}, status=status.HTTP_200_OK) 

    @extend_schema(
        description="Verify two factor authentication.",
        request=serializer_class,
        responses={200: {"description": "Two factor authentication verified successfully"}}
    )

    def post(self, request):
        user = request.user
        code = request.data.get('code', '')

        if not user.totp_secret:
            Console.error(f"User: {user.email} does not have two factor authentication enabled")
            return Response(status=status.HTTP_400_BAD_REQUEST)

        totp = pyotp.TOTP(user.totp_secret)

        if totp.verify(code):
            if not in_double_auth.get(user.email):
                user.totp_verified = True
                user.save()
                return Response(status=status.HTTP_200_OK)
            else:
                del in_double_auth[user.email]
                return Response({
                    'username': user.username,
                    'email': user.email,
                    'avatar': user.avatar
                }, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
