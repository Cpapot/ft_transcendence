from rest_framework.views import APIView
from rest_framework import status, permissions
from drf_spectacular.utils import extend_schema
from rest_framework.response import Response

from ...serializers.account import UserEmailExist
from ...services.user_service import UserService

class AuthVerifyUserView(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = UserEmailExist

    @extend_schema(
        description="Check if user exist in database.",
        request=serializer_class,
        responses={200: {"description": "User exist in database"}}
    )

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data

        if UserService.get_first("email", user.get('email')):
            return Response({'exist': True}, status=status.HTTP_200_OK)
        return Response({'exist': False}, status=status.HTTP_200_OK)
