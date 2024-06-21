import pyotp
from rest_framework.views import APIView
from rest_framework import status, permissions
from drf_spectacular.utils import extend_schema
from rest_framework.response import Response

from ...serializers.empty import EmptySerializer
from ...logger import Console

class ChangeTwoFAView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = EmptySerializer

    @extend_schema(
        description="Change two factor authentication.",
        request=serializer_class,
        responses={200: {"description": "Two factor authentication changed successfully"}}
    )

    def get(self, request):
        user = request.user
        email = user.email

        if user.totp_secret and user.totp_verified:
            user.totp_secret = None
            user.totp_verified = False
            user.save()
            return Response({}, status=status.HTTP_200_OK)
        else:
            secret = pyotp.random_base32()
            totp = pyotp.TOTP(secret)
            otp_url = totp.provisioning_uri(email, issuer_name='Transcendence')
            user.totp_secret = secret
            user.save()
            return Response({'otp_url': otp_url}, status=status.HTTP_200_OK)
