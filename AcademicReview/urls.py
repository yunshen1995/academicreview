"""AcademicReview URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.conf.urls import url, include
from rest_framework.routers import DefaultRouter
from allauth.account.views import confirm_email
from rest_framework_jwt.views import verify_jwt_token
from academic.views import UserViewSet, CollegeViewSet, CourseViewSet, ReplyViewSet, ReviewViewSet, IndexView

router = DefaultRouter()
router.register(prefix='users', viewset=UserViewSet)
router.register(prefix='colleges', viewset=CollegeViewSet)
router.register(prefix='courses', viewset=CourseViewSet)
router.register(prefix='replies', viewset=ReplyViewSet)
router.register(prefix='reviews', viewset=ReviewViewSet)


urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^api/v1/', include(router.urls)),
    url(r'^api/v1/', include('rest_framework.urls')),
    url(r'^api/v1/jwt/', include('rest_auth.urls')),
    url(r'^api/v1/jwt/api-token-verify/', verify_jwt_token),
    url(r'^api/v1/account/', include('allauth.urls')),
    url(r'^api/v1/registration', include('rest_auth.registration.urls')),
    url(r'^api/v1/account-confirm-email/(?P<key>[-:\w]+)/$',confirm_email, name='account_confirm_email'),
    url('^.*$', IndexView.as_view(), name='index'),
]
