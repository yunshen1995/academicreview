from rest_framework import serializers
from django.contrib.auth import update_session_auth_hash
from rest_auth.registration.serializers import RegisterSerializer
from .models import User, College, Course, StudentCourse, Reply, Review


class StudentCourseSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField(source='course.id')
    name = serializers.ReadOnlyField(source='course.name')

    class Meta:
        model = StudentCourse
        fields = ('id', 'name', 'year', 'start_date', 'end_date')


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ('id', 'rating', 'comment', 'reviewer', 'type')


class ReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = Reply
        fields = ('id', 'review', 'replier', 'comment')


class CustomRegisterSerializer(RegisterSerializer):
    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)

    def save(self, request):
        user = super(CustomRegisterSerializer, self).save(request)
        # user.is_active = False
        user.first_name = self.validated_data.get('first_name')
        user.last_name = self.validated_data.get('last_name')
        user.save()
        return user


class UserSerializer(serializers.ModelSerializer):
    course = StudentCourseSerializer(source='studentcourse_set', many=True, allow_null=True)
    password = serializers.CharField(style={'input_type': 'password'}, write_only=True, required=False)
    confirm_password = serializers.CharField(style={'input_type': 'password'}, write_only=True, required=False)
    reviews = ReviewSerializer(many=True, allow_null=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'gender', 'dob', 'address',
                  'contact_number', 'user_type', 'course', 'reviews', 'password', 'confirm_password')

    def create(self, validated_data):
        user = User(
            email=validated_data['email'],
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            gender=validated_data['gender'],
            dob=validated_data['dob'],
            address=validated_data['address'],
            contact_number=validated_data['contact_number'],
            user_type=validated_data['user_type'],
        )
        user.set_password(validated_data['password'])
        user.save()

        if "course" in self.initial_data:
            course = self.initial_data.get("course")
            for c in course:
                id = c.get("id")
                year = c.get("year")
                start_date = c.get("start_date")
                end_date = c.get("end_date")
                course_instance = Course.objects.get(pk=id)
                StudentCourse(course=course_instance, user=user, year=year, start_date=start_date, end_date=end_date).save()

        if "reviews" in self.initial_data:
            reviews = self.initial_data.get("reviews")
            for r in reviews:
                rating = r.get("rating")
                comment = r.get("comment")
                reviewer = r.get("reviewer")
                type = r.get("type")
                reviewer_instance = User.objects.get(id=reviewer)
                r1 = Review(rating=rating, comment=comment, reviewer=reviewer_instance, type=type)
                r1.save()
                user.reviews.add(r1.id)
        user.save()
        return user

    def update(self, instance, validated_data):

        if "course" in self.initial_data:
            StudentCourse.objects.filter(user=instance).delete()
            course = self.initial_data.get("course")
            for c in course:
                id = c.get("id")
                year = c.get("year")
                start_date = c.get("start_date")
                end_date = c.get("end_date")
                course_instance = Course.objects.get(pk=id)
                StudentCourse(course=course_instance, user=instance, year=year, start_date=start_date, end_date=end_date).save()

        if "reviews" in self.initial_data:
            rev_all = instance.reviews.all()
            for r in rev_all:
                instance.reviews.remove(r)
                Review.objects.get(id=r.id).delete()
            reviews = self.initial_data.get("reviews")
            for r in reviews:
                rating = r.get("rating")
                comment = r.get("comment")
                reviewer = r.get("reviewer")
                type = r.get("type")
                reviewer_instance = User.objects.get(id=reviewer)
                r1 = Review(rating=rating, comment=comment, reviewer=reviewer_instance, type=type)
                r1.save()
                instance.reviews.add(r1.id)

        password = validated_data.get('password', None)
        confirm_password = validated_data.get('confirm_password', None)

        if password and confirm_password and password == confirm_password:
            instance.set_password(password)
            instance.save()
            del validated_data['password']
            del validated_data['confirm_password']

        update_session_auth_hash(self.context.get('request'), instance)

        instance.__dict__.update(**validated_data)
        instance.save()
        return instance


class CollegeSerializer(serializers.ModelSerializer):
    reviews = ReviewSerializer(many=True, allow_null=True)

    class Meta:
        model = College
        fields = ('id', 'name', 'email', 'address', 'contact_number', 'reviews')

    def create(self, validated_data):
        college = College(
            name=validated_data['name'],
            email=validated_data['email'],
            address=validated_data['address'],
            contact_number=validated_data['contact_number'],
        )
        college.save()

        if "reviews" in self.initial_data:
            reviews = self.initial_data.get("reviews")
            for r in reviews:
                rating = r.get("rating")
                comment = r.get("comment")
                reviewer = r.get("reviewer")
                type = r.get("type")
                reviewer_instance = User.objects.get(id=reviewer)
                r1 = Review(rating=rating, comment=comment, reviewer=reviewer_instance, type=type)
                r1.save()
                college.reviews.add(r1.id)
        college.save()
        return college

    def update(self, instance, validated_data):
        instance.__dict__.update(**validated_data)
        instance.save()

        if "reviews" in self.initial_data:
            reviews = self.initial_data.get("reviews")
            for r in reviews:
                rating = r.get("rating")
                comment = r.get("comment")
                reviewer = r.get("reviewer")
                type = r.get("type")
                reviewer_instance = User.objects.get(id=reviewer)
                r1 = Review(rating=rating, comment=comment, reviewer=reviewer_instance, type=type)
                r1.save()
                instance.reviews.add(r1.id)
        instance.save()
        return instance


class CourseSerializer(serializers.ModelSerializer):
    reviews = ReviewSerializer(many=True, allow_null=True)
    college = serializers.ReadOnlyField(source='college.name')

    class Meta:
        model = Course
        fields = ('id', 'name', 'course_leader', 'college', 'students', 'reviews')

    def create(self, validated_data):
        cid = int(self.initial_data['college'])
        college = College.objects.filter(id=cid)[0]
        course = Course(
            name=validated_data['name'],
            course_leader=validated_data['course_leader'],
            college=college,
        )
        course.save()

        if "reviews" in self.initial_data:
            reviews = self.initial_data.get("reviews")
            for r in reviews:
                rating = r.get("rating")
                comment = r.get("comment")
                reviewer = r.get("reviewer")
                type = r.get("type")
                reviewer_instance = User.objects.get(id=reviewer)
                r1 = Review(rating=rating, comment=comment, reviewer=reviewer_instance, type=type)
                r1.save()
                course.reviews.add(r1.id)
        course.save()
        return course

    def update(self, instance, validated_data):
        cid = int(self.initial_data['college'])
        college = College.objects.filter(id=cid)[0]
        instance.college = college
        instance.__dict__.update(**validated_data)
        instance.save()

        if "reviews" in self.initial_data:
            reviews = self.initial_data.get("reviews")
            for r in reviews:
                rating = r.get("rating")
                comment = r.get("comment")
                reviewer = r.get("reviewer")
                type = r.get("type")
                reviewer_instance = User.objects.get(id=reviewer)
                r1 = Review(rating=rating, comment=comment, reviewer=reviewer_instance, type=type)
                r1.save()
                instance.reviews.add(r1.id)
        instance.save()
        return instance
