from django.test import TestCase
from django.contrib.auth.models import User, Group
from attendance.models import Course, Class, QRCodes
from django.core.files.storage import default_storage
from django.conf import settings
from django.utils import timezone
import datetime

class QRCodeGenerationTestCase(TestCase):
  def setUp(self):
      self.user = User.objects.create_user(username='teacher', password='pass', is_staff=True)
      self.university = Group.objects.create(name="Sample University")
      self.course = Course.objects.create(name="Sample Course", university=self.university)
      self.schedule = timezone.make_aware(datetime.datetime.now() + datetime.timedelta(days=1))
      self.new_class = Class.objects.create(
          course=self.course,
          teacher=self.user,
          university=self.university,
          schedule=self.schedule
      )

  def test_qr_code_generation(self):
        qr_code = QRCodes.objects.get(class_instance=self.new_class)
        self.assertIsNotNone(qr_code.qr_code_url)
        # Check if the QR code file exists in the storage
        file_exists = default_storage.exists(qr_code.qr_code_url.split(settings.MEDIA_URL)[-1])
        self.assertTrue(file_exists)

class AuthenticationTestCase(TestCase):
  def setUp(self):
      self.user = User.objects.create_user(username='testuser', password='password')

  def test_user_creation(self):
      self.assertTrue(User.objects.filter(username='testuser').exists())