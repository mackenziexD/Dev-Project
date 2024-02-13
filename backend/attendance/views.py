from django.contrib.auth.models import User, Group
from rest_framework import viewsets, permissions, response as Responce, status
from rest_fromework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from attendance.serializers import UserSerializer, GroupSerializer, UniversitySerializer, CourseSerializer, ClassSerializer, AttendanceRecordSerializer, CustomTokenObtainPairSerializer
from attendance.models import University, Course, Class, AttendanceRecord

class BlacklistTokenView(viewsets.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Responce(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Responce(status=status.HTTP_400_BAD_REQUEST)

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

class UniversityViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows universities to be viewed or edited.
    """
    queryset = University.objects.all()
    serializer_class = UniversitySerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

class CourseViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows courses to be viewed or edited.
    """
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

class ClassViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows classes to be viewed or edited.
    """
    queryset = Class.objects.all()
    serializer_class = ClassSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

class AttendanceRecordViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows attendance records to be viewed or edited.
    """
    serializer_class = AttendanceRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        This view returns a list of all attendance records for staff users,
        or just the attendance records associated with the currently authenticated user if they are not staff.
        """
        user = self.request.user
        if user.is_staff:
            return AttendanceRecord.objects.all().order_by('student__username')
        else:
            return AttendanceRecord.objects.filter(student=user).order_by('student__username')

class CustomTokenObtainPairView(TokenObtainPairView):
        serializer_class = CustomTokenObtainPairSerializer