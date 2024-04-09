from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from attendance import views

from rest_framework_simplejwt import views as jwt_views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)
router.register(r'universities', views.UniversityViewSet)
router.register(r'courses', views.CourseViewSet)
router.register(r'classes', views.ClassViewSet)
router.register(r'attendancerecords', views.AttendanceRecordViewSet, basename='attendancerecord')
router.register(r'me', views.MeViewSet, basename='me')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(router.urls)),
    # path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path("api/token/", views.CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", jwt_views.TokenRefreshView.as_view(), name="token_refresh"),
    path("api/token/blacklist/", jwt_views.TokenBlacklistView.as_view(), name="token_blacklist"),
]
