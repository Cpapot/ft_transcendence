from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema

from ....globals.global_variables import reset_password_uuid
from ....serializers.auth import ChangePasswordSerializer
from ....services.user_service import UserService

class ChangePasswordView(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = ChangePasswordSerializer

    @extend_schema(
        description="Change password for a user account",
        request=serializer_class,
        responses={200: {"description": "Password changed"}}
    )

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        code = data.get('code')
        if (not code or not reset_password_uuid[code]):
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if (data.get('new_password') != data.get('confirm_new_password')):
            return Response(status=status.HTTP_400_BAD_REQUEST)

        UserService.change_password(reset_password_uuid[code], data.get('new_password'))
        del reset_password_uuid[code]
        return Response(status=status.HTTP_200_OK)
