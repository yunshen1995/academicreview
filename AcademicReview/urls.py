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
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from allauth.account.views import confirm_email, password_reset_from_key
from rest_framework_jwt.views import verify_jwt_token
from academic.views import UserViewSet, CollegeViewSet, CourseViewSet, ReplyViewSet, ReviewViewSet, IndexView, \
    CollegeApplicationViewSet, ReportViewSet, Notification, ApplicationReport

router = DefaultRouter()
router.register(prefix='users', viewset=UserViewSet)
router.register(prefix='colleges', viewset=CollegeViewSet)
router.register(prefix='courses', viewset=CourseViewSet)
router.register(prefix='replies', viewset=ReplyViewSet)
router.register(prefix='reviews', viewset=ReviewViewSet)
router.register(prefix='collegeapplication', viewset=CollegeApplicationViewSet)
router.register(prefix='report', viewset=ReportViewSet)


urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^api/v1/', include(router.urls)),
    url(r'^api/v1/', include('rest_framework.urls')),
    url(r'^api/v1/notification/', Notification.as_view()),
    url(r'^api/v1/applicationreport/', ApplicationReport.as_view()),
    url(r'^api/v1/jwt/', include('rest_auth.urls')),
    url(r'^api/v1/jwt/api-token-verify/', verify_jwt_token),
    url(r'^api/v1/account/', include('allauth.urls')),
    url(r'^api/v1/registration', include('rest_auth.registration.urls')),
    url(r'^api/v1/account-confirm-email/(?P<key>[-:\w]+)/$',confirm_email, name='account_confirm_email'),
    url(r'^password-reset/confirm/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',
        password_reset_from_key,
        name='password_reset_confirm'),
    url('^.*$', IndexView.as_view(), name='index'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
