from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User

class UserViewSetTestCase(APITestCase):
    """
    Permissions and Access Control Test
    """
    def setUp(self):
        self.admin_user = User.objects.create_user(username='admin', is_staff=True, is_superuser=True)
        self.normal_user = User.objects.create_user(username='user')

    def test_user_restriction(self):
        self.client.force_authenticate(user=self.normal_user)
        response = self.client.get(reverse('user-detail', args=[self.admin_user.pk]))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN, msg=f"Expected HTTP 403 Forbidden, got {response.status_code}. Response data: {response.data}")

        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(reverse('user-detail', args=[self.admin_user.pk]))
        self.assertEqual(response.status_code, status.HTTP_200_OK, msg=f"Expected HTTP 201 Created, got {response.status_code}. Response data: {response.data}" )