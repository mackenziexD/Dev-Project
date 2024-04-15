from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.models import Group
    
class Course(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20)
    university = models.ForeignKey(Group, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.name}"

class Class(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    teacher = models.ForeignKey(User, on_delete=models.CASCADE)
    students = models.ManyToManyField(User, related_name='enrolled_classes')
    university = models.ForeignKey(Group, on_delete=models.CASCADE)
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
    
class QRCodes(models.Model):
    class_instance = models.ForeignKey('Class', on_delete=models.CASCADE)
    qr_code_url = models.URLField(max_length=200)  # Adjust field type if needed

    def __str__(self):
        return f"QR Code for {self.class_instance}"