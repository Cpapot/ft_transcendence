from rest_framework.views import APIView
from rest_framework import status, permissions
from rest_framework.response import Response

from ...services.user_service import UserService
from ...serializers.empty import EmptySerializer

class AccountDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = EmptySerializer

    def delete(self, request):
        UserService.delete(request.user)
        return Response(status=status.HTTP_204_NO_CONTENT)
