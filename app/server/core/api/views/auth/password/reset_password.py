import uuid

from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema
from django.core.mail import send_mail
from django.conf import settings

from ....globals.global_variables import reset_password_uuid
from ....serializers.auth import ForgotPasswordSerializer
from ....services.user_service import UserService

from ....logger import Console

class ForgotPasswordView(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = ForgotPasswordSerializer

    @extend_schema(
        description="Reset password for a user account",
        request=serializer_class,
        responses={200: {"description": "Password reset email sent"}}
    )

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data.get('email')

        if not UserService.exists("email", email):
            return Response({"message": "L'email n'est pas associé à un compte"}, status=status.HTTP_400_BAD_REQUEST)

        code_uuid = str(uuid.uuid4())
        reset_password_uuid[code_uuid] = email

        subject = 'Instructions pour réinitialiser votre mot de passe'
        message = f'Cliquez sur le lien suivant pour réinitialiser votre mot de passe:\n \
        https://localhost:8080/reset-password?reset_code={code_uuid}'
        email_from = f"Transcendence Support <{settings.EMAIL_HOST_USER}>"
        recipient_list = [email]

        Console.info(f"Reset password requested for email: {email}")
        send_mail(subject, message, email_from, recipient_list)
        return Response(status=status.HTTP_200_OK)
