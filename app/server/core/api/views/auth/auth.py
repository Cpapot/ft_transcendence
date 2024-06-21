from rest_framework import status, permissions
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema

from ...serializers.user import UserSerializer
from ...serializers.auth import CustomTokenObtainPairSerializer
from ...globals.global_variables import in_double_auth

from ...services.user_service import UserService
from ...services.user_history_service import UserHistoryService
from ...services.token_service import TokenService

from ...logger import Console
from .auth_intra import IntraAPI

class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = [permissions.AllowAny]
    serializer_class = CustomTokenObtainPairSerializer

    @extend_schema(
        description="Obtain JWT token pair with code or email and password.",
        request=serializer_class,
        responses={200: {"description": "Token pair generated successfully"}}
    )

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data

        code = user.get('code')
        data_send = code and IntraAPI().setup_token(code) or request.data
        if (not data_send):
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if code and data_send.get("username"):
            data_send['auth_method'] = 'intra'

        serializer = UserSerializer(data=data_send)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                send_data = TokenService.generate(user)
                if user.totp_verified:
                    in_double_auth[user.email] = True
                    send_data['double_auth'] = True
                else:
                    send_data['username'] = user.username
                    send_data['email'] = user.email
                    send_data['avatar'] = user.avatar
                UserHistoryService.connect(user.username, request.META.get('REMOTE_ADDR'))
                return Response(send_data, status=status.HTTP_200_OK)

        Console.error(f"Failed to login: {data_send}, {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
