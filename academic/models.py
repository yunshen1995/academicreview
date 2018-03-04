from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    USERTYPE_CHOICES = (
        ('Admin', 'Admin'),
        ('CollegeAdmin', 'CollegeAdmin'),
        ('Lecturer', 'Lecturer'),
        ('Student', 'Student'),
    )
    GENDER_CHOICES = (
        ('M', 'Male'),
        ('F', 'Female'),
        ('N', 'Prefer Not To Say'),
    )
    id = models.AutoField(primary_key=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    dob = models.DateField()
    address = models.CharField(max_length=300)
    contact_number = models.CharField(max_length=30)
    user_type = models.CharField(max_length=15, choices=USERTYPE_CHOICES)
    course = models.ManyToManyField('Course', through='StudentCourse', related_name='students')
    reviews = models.ManyToManyField('Review', related_name='students')

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
    email = models.EmailField()
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
    comment = models.CharField(max_length=300)
    reviewer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    type = models.CharField(max_length=30, blank=True)


class Reply(models.Model):
    id = models.AutoField(primary_key=True)
    review = models.ForeignKey(Review, on_delete=models.CASCADE)
    replier = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    comment = models.CharField(max_length=300)
