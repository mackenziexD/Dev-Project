from django.db.models.signals import m2m_changed
from django.dispatch import receiver
from .models import Class, AttendanceRecord

@receiver(m2m_changed, sender=Class.students.through)
def create_attendance_records(sender, instance, action, pk_set, **kwargs):
    if action == "post_add":
        # When students are added to a class, create AttendanceRecord entries for them
        for student_pk in pk_set:
            AttendanceRecord.objects.get_or_create(
                student_id=student_pk,
                class_instance=instance,
                defaults={'attended': False}  # Default value for attended
            )
