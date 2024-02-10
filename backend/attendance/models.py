from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.models import Group

class University(models.Model):
    name = models.CharField(max_length=100)

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    university = models.ForeignKey(University, on_delete=models.SET_NULL, null=True)
    is_lecturer = models.BooleanField(default=True)
# Extends the User model to include specific details like university and role (student/lecturer).
    
class Course(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20)
    university = models.ForeignKey(University, on_delete=models.CASCADE)

class Class(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    teacher = models.ForeignKey(User, on_delete=models.CASCADE)
    students = models.ManyToManyField(User, related_name='enrolled_classes')
    schedule = models.DateTimeField()

class AttendanceRecord(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    class_instance = models.ForeignKey(Class, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    attended = models.BooleanField(default=False)
