from django.contrib.auth.models import User, Group
from rest_framework import serializers
from .models import Course, Class, AttendanceRecord, QRCodes
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UserSerializer(serializers.HyperlinkedModelSerializer):
    groups = serializers.PrimaryKeyRelatedField(queryset=Group.objects.all(), many=True, required=False)
    group_names = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups', 'group_names', 'is_staff', 'is_active', 'id', 'first_name', 'last_name', 'is_superuser']

    def get_group_names(self, obj):
        """Returns a list of group names for the user."""
        return [group.name for group in obj.groups.all()]
    
    def create(self, validated_data):
        groups_data = validated_data.pop('groups', None)
        user = User.objects.create(**validated_data)
        if groups_data:
            user.groups.set(groups_data)
        user.save()
        return user

class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name', 'id']

class CourseSerializer(serializers.ModelSerializer):
    university_name = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = '__all__'
        read_only_fields = ['university']

    def get_university_name(self, obj):
        return obj.university.name
    
    def update(self, instance, validated_data):
        # ignore the university field on updates as we dont want to change it once created.
        validated_data.pop('university', None)
        return super().update(instance, validated_data)

class ClassSerializer(serializers.ModelSerializer):
    students = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), many=True)
    students_names = serializers.SerializerMethodField()
    teacher = serializers.StringRelatedField()
    course_name = serializers.CharField(source='course.name', read_only=True)
    students_attendance = serializers.SerializerMethodField()
    
    class Meta:
        model = Class
        fields = ['id', 'course', 'course_name', 'teacher', 'students', 'students_names', 'university', 'schedule', 'students_attendance']

    def get_students_names(self, obj):
        return [student.username for student in obj.students.all()]
    
    def get_students_attendance(self, obj):
        attendance_records = AttendanceRecord.objects.filter(class_instance=obj)
        return [
            {
                "student_id": record.student.id,
                "student_name": record.student.username,
                "attended": record.attended
            }
            for record in attendance_records
        ]
    
class AttendanceRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttendanceRecord
        fields = '__all__'

class QRCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = QRCodes
        fields = '__all__'
        read_only_fields = ['class_instance', 'qr_code_url']

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['username'] = user.username
        token['email'] = user.email
        token['groups'] = list(user.groups.values_list('name', flat=True))
        token['is_staff'] = user.is_staff
        token['is_active'] = user.is_active
        token['is_superuser'] = user.is_superuser

        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        return data