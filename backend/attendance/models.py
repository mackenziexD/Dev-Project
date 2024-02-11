from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.models import Group

class University(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    
class Course(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20)
    university = models.ForeignKey(University, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.name}"

class Class(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    teacher = models.ForeignKey(User, on_delete=models.CASCADE)
    students = models.ManyToManyField(User, related_name='enrolled_classes')
    university = models.ForeignKey(University, on_delete=models.CASCADE, null=True, blank=True)
    schedule = models.DateTimeField()

    def __str__(self):
        return f"{self.course.name}"

class AttendanceRecord(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    class_instance = models.ForeignKey(Class, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    attended = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.student.username} - {self.class_instance.course.name} - {self.date}"
