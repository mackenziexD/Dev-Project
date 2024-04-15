from django.db.models.signals import m2m_changed, post_save
from django.dispatch import receiver
from django.conf import settings
from django.core.mail import send_mail
from django.conf import settings
from .models import Class, AttendanceRecord, User, Class, QRCodes
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from io import BytesIO
import qrcode

def generate_qr_code(class_id):
    qr_url = f"{settings.NEXT_FRONT_END_URL}/register/attendance/{class_id}"

    qr_img = qrcode.make(qr_url)
    qr_io = BytesIO()
    qr_img.save(qr_io, format='PNG')
    qr_io.seek(0)

    filename = f'qr_codes/class_{class_id}_qr.png'
    # Store the QR code in the media folder and get the file path
    file_path = default_storage.save(filename, ContentFile(qr_io.getvalue()))

    # Construct the full URL for the stored QR code image
    qr_image_url = f'{settings.MEDIA_URL}{file_path}'
    return qr_image_url

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

@receiver(post_save, sender=User)
def create_user_password(sender, instance, created, **kwargs):
    if created:
        password = User.objects.make_random_password()
        instance.set_password(password)
        instance.save()
        send_mail(
            'Welcome to the Attendance System',
            f'Your password is: {password}\nPlease change it upon your first login.',
            settings.DEFAULT_FROM_EMAIL,
            [instance.email],
            fail_silently=False,
        )

@receiver(post_save, sender=Class)
def generate_qr_code_for_class(sender, instance, created, **kwargs):
    if created:
        qr_code_url = generate_qr_code(instance.id)
        QRCodes.objects.create(
            class_instance=instance,
            qr_code_url=qr_code_url
        )
        