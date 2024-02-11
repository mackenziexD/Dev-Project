from django.contrib.auth.models import User, Group
from rest_framework import serializers
from .models import University, Course, Class, AttendanceRecord
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']

class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']

class UniversitySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = University
        fields = '__all__'

class CourseSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'

class ClassSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Class
        fields = '__all__'

class AttendanceRecordSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = AttendanceRecord
        fields = '__all__'

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['username'] = user.username
        token['email'] = user.email
        token['groups'] = list(user.groups.values_list('name', flat=True))
        token['is_staff'] = user.is_staff
        token['is_active'] = user.is_active

        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        return data