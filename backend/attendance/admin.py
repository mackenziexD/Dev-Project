from django.contrib import admin
from .models import Course, Class, AttendanceRecord, QRCodes
from django import forms
from django.contrib.auth.models import User

class ClassAdminForm(forms.ModelForm):
    teacher = forms.ModelChoiceField(queryset=User.objects.filter(is_staff=True))
    class Meta:
        model = Class
        fields = '__all__'

@admin.register(Class)
class ClassAdmin(admin.ModelAdmin):
    form = ClassAdminForm
    list_display = ('course', 'university', 'teacher', 'formatted_schedule', 'students_attendance')
    
    def formatted_schedule(self, obj):
        return obj.schedule.strftime("%B %d, %Y, %I:%M %p")
    formatted_schedule.admin_order_field = 'schedule'
    formatted_schedule.short_description = 'Scheduled Time'

    def students_attendance(self, obj):
        attendance_count = AttendanceRecord.objects.filter(class_instance=obj, attended=True).count()
        students_count = obj.students.count()
        return "{} / {}".format(attendance_count, students_count)
    
    students_attendance.short_description = 'Students Attended'

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'university')
    list_filter = ('university',)
    search_fields = ('name', 'code')

@admin.register(AttendanceRecord)
class AttendanceRecordAdmin(admin.ModelAdmin):
    list_display = ('student', 'class_instance', 'date', 'attended')
    list_filter = ('class_instance', 'attended')
    search_fields = ('student__username', 'class_instance__course__name')

@admin.register(QRCodes)
class QRCodesAdmin(admin.ModelAdmin):
    list_display = ('class_instance', 'qr_code_url')
    search_fields = ('class_instance__course__name',)