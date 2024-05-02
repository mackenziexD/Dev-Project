from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User, Group
from attendance.models import Class, Course
from django.utils import timezone
import datetime
from django.utils import timezone

class ClassViewSetTestCase(APITestCase):
  def setUp(self):
      self.user = User.objects.create_user(username='teacher', password='pass', is_superuser=True, is_staff=True)
      self.university = Group.objects.create(name="Sample University")
      self.course = Course.objects.create(name="Sample Course", university=self.university)
      self.schedule = timezone.make_aware(datetime.datetime.now() + datetime.timedelta(days=1))
      self.clazz = Class.objects.create(course=self.course, teacher=self.user, university=self.university, schedule=self.schedule)
      self.client.force_authenticate(user=self.user)

  def test_class_create(self):
      url = reverse('class-list')
      data = {
          'course': self.course.pk,
          'teacher': self.user.pk,
          'university': self.university.pk,
          'schedule': self.schedule.isoformat(),
          'students': []  # No students for now
      }
      response = self.client.post(url, data, format='json')
      self.assertEqual(response.status_code, status.HTTP_201_CREATED, msg=f"Expected HTTP 201 Created, got {response.status_code}. Response data: {response.data}")

  def test_class_update(self):
      url = reverse('class-detail', args=[self.clazz.pk])
      data = {
          'course': self.course.pk, 
          'schedule': self.schedule.isoformat(),
          'students': []  # No students for now
      }
      response = self.client.patch(url, data, format='json')
      self.assertEqual(response.status_code, status.HTTP_200_OK, msg=f"Expected HTTP 200 OK, got {response.status_code}. Response data: {response.data}")