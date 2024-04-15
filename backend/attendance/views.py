from django.contrib.auth.models import User, Group
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from attendance.serializers import UserSerializer, GroupSerializer, CourseSerializer, ClassSerializer, AttendanceRecordSerializer, CustomTokenObtainPairSerializer
from attendance.models import Course, Class, AttendanceRecord
from rest_framework import status
from django.utils import timezone

class IsSuperUser(permissions.IsAdminUser):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_superuser)

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return User.objects.all().order_by('username')
        return User.objects.filter(groups=user.groups.first()).order_by('username')
    
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)
    
    def create(self, request, *args, **kwargs):
        print(request.data)
        # if theres no groups data passed in the request, set the group to the user's group
        if 'groups' not in request.data:
            request.data['groups'] = [request.user.groups.first().id]
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print(serializer.errors) 
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return super().create(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
    
class StudentsViewSet(viewsets.ModelViewSet):
    """
    API endpoint that gets users where not staff or superuser
    """
    queryset = User.objects.filter(is_staff=False, is_superuser=False).order_by('username')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

class MeViewSet(viewsets.GenericViewSet):
    """
    API endpoint that allows the currently authenticated user to be viewed.
    This will return username, email, groups, is_staff, is_active, and user_id.
    """
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request, *args, **kwargs):
        """
        Override the default list method to return the current user's details,
        including the request context for the serializer.
        """
        user = request.user
        serializer = UserSerializer(user, context={'request': request})
        return Response(serializer.data)
    
class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be edited/created/deleted.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def get_queryset(self):
        """"
        return all groups if superuser otherwise return just the group the user is in
        """
        user = self.request.user
        if user.is_superuser:
            return Group.objects.all().order_by('id')
        return Group.objects.filter(user=user).order_by('id')
        

    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)
    
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

class CourseViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows courses to be viewed or edited.
    """
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def get_queryset(self):
        """
        This view returns a list of all courses that the matches the teachers group
        """
        user = self.request.user
        if user.is_superuser:
            return Course.objects.all().order_by('-id')
        return Course.objects.filter(university=user.groups.first()).order_by('-id')
    
    def create(self, request, *args, **kwargs):
        print(request.data)
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print(serializer.errors) 
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return super().create(request, *args, **kwargs)

class ClassViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows classes to be viewed or edited.
    """
    queryset = Class.objects.all()
    serializer_class = ClassSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def get_queryset(self):
        """
        This view returns a list of all courses that the matches the teachers group
        """
        user = self.request.user
        if user.is_superuser:
            return Class.objects.all().order_by('schedule')
        return Class.objects.filter(university=user.groups.first()).order_by('schedule')
            
    def create(self, request, *args, **kwargs):
        print(request.data)
        serializer = self.get_serializer(data=request.data)
        course = Course.objects.get(id=request.data.get('course'))
        request.data['university'] = course.university.id
        if not serializer.is_valid():
            print(serializer.errors) 
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return super().create(request, *args, **kwargs)
    
    def perform_create(self, serializer):
            serializer.save(teacher=self.request.user)

    def update(self, request, *args, **kwargs):
        print(request.data)
        serializer = self.get_serializer(data=request.data)
        course = Course.objects.get(id=request.data.get('course'))
        request.data['university'] = course.university.id
        if not serializer.is_valid():
            print(serializer.errors) 
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return super().update(request, *args, **kwargs)
    
    def perform_update(self, serializer):
        serializer.save(teacher=self.request.user)
        
class MyUpcomingClassesViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows upcoming classes to be viewed.
    """
    serializer_class = ClassSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        This view returns a list of all classes that the currently authenticated user is enrolled in.
        """
        user = self.request.user
        now = timezone.now()
        base_query = Class.objects.filter(schedule__gte=now).order_by('schedule')

        if user.is_staff:
            query = base_query.filter(teacher=user)
        else:
            query = base_query.filter(students=user)

        return query[:10]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
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
        
    def update(self, request, *args, **kwargs):
        print(request.data)
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print(serializer.errors) 
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return super().update(request, *args, **kwargs)

class CustomTokenObtainPairView(TokenObtainPairView):
        serializer_class = CustomTokenObtainPairSerializer