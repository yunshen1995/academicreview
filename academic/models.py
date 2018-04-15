from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import BaseUserManager
from datetime import datetime, timedelta


class AccountManager(BaseUserManager):
    def create_user(self, email, password=None, **kwargs):
        if not email:
            raise ValueError('Users must have a valid email address.')
        if not kwargs.get('username'):
            raise ValueError('Users must have a valid username.')
        account = self.model(
            email=self.normalize_email(email), username=kwargs.get('username')
        )

        account.set_password(password)
        account.save()
        return account

    def create_superuser(self, email, password, **kwargs):
        account = self.create_user(email, password, **kwargs)
        account.is_staff = True
        account.save()
        return account


class User(AbstractUser):
    USERTYPE_CHOICES = (
        ('Admin', 'Admin'),
        ('CollegeAdmin', 'CollegeAdmin'),
        ('Lecturer', 'Lecturer'),
        ('Student', 'Student'),
    )
    id = models.AutoField(primary_key=True)
    gender = models.CharField(max_length=30, null=True)
    dob = models.DateField(null=True)
    address = models.CharField(max_length=300, null=True)
    contact_number = models.CharField(max_length=30, null=True)
    user_type = models.CharField(max_length=15, choices=USERTYPE_CHOICES, null=True)
    course = models.ManyToManyField('Course', through='StudentCourse', related_name='students')
    reviews = models.ManyToManyField('Review', related_name='students')
    objects = AccountManager()

    def get_full_name(self):
        return ' '.join([self.first_name, self.last_name])

    def get_short_name(self):
        return self.first_name

    def __str__(self):
        return "%s (%s)" % (self.get_full_name(), self.username)

    def __unicode__(self):
        return "%s (%s)" % (self.get_full_name(), self.username)


class College(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    address = models.CharField(max_length=300)
    contact_number = models.CharField(max_length=30)
    reviews = models.ManyToManyField('Review', related_name='colleges')

    def __str__(self):
        return self.name

    def __unicode__(self):
        return self.name


class Course(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=150)
    course_leader = models.CharField(max_length=150, blank=True)
    college = models.ForeignKey(College, on_delete=models.CASCADE)
    reviews = models.ManyToManyField('Review', related_name='courses')

    def __str__(self):
        return self.name

    def __unicode__(self):
        return self.name


class StudentCourse(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    year = models.CharField(max_length=4, blank=True)
    start_date = models.DateField(blank=True)
    end_date = models.DateField(blank=True)


class Review(models.Model):
    id = models.AutoField(primary_key=True)
    rating = models.IntegerField()
    comment = models.CharField(max_length=3000)
    reviewer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    type = models.CharField(max_length=30, blank=True)
    date = models.DateTimeField(default=datetime.now, blank=True)


class Reply(models.Model):
    id = models.AutoField(primary_key=True)
    review = models.ForeignKey(Review, on_delete=models.CASCADE)
    replier = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    comment = models.CharField(max_length=3000)
    date = models.DateTimeField(default=datetime.now, blank=True)


class CollegeApplication(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    address = models.CharField(max_length=300)
    contact_number = models.CharField(max_length=30)
    applied = models.DateTimeField(auto_now_add=True)
    notification = models.BooleanField(default=True)
    courses = models.FileField()
