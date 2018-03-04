from rest_framework import viewsets, response
from .models import User, College, Course, Reply, Review, StudentCourse
from .serializers import UserSerializer, CollegeSerializer, ReplySerializer, ReviewSerializer, CourseSerializer, StudentCourseSerializer
from rest_framework.decorators import detail_route
from rest_framework.exceptions import ParseError


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @detail_route(methods=['get', 'post'], url_path='course')
    def course(self, request, pk=None):
        if request.method == 'POST':
            return self.add_course(request, pk=pk)
        else:
            return self.all_course(request, pk=pk)

    def all_course(self, request, pk=None):
        user = User.objects.filter(id=pk)
        studentcourse = StudentCourse.objects.filter(user=user[0])
        serializer = []
        for s in studentcourse:
            serializer.append(StudentCourseSerializer(s).data)
        return response.Response(serializer)

    def add_course(self, request, pk=None):
        user = User.objects.filter(id=pk)[0]
        courses = request.data['course']
        for c in courses:
            course = Course.objects.filter(id=c.get("id"))[0]
            year = c.get("year")
            start_date = c.get("start_date")
            end_date = c.get("end_date")
            if StudentCourse.objects.filter(course_id=course.id).filter(user_id=user.id):
                raise ParseError('Student with name %s already exists for course %s' % (user.get_full_name(), course.name))
            else:
                StudentCourse(course=course, user=user, year=year, start_date=start_date, end_date=end_date).save()

        studentcourse = StudentCourse.objects.filter(user=user)
        serializer = []
        for s in studentcourse:
            serializer.append(StudentCourseSerializer(s).data)
        return response.Response(serializer)

    @detail_route(methods=['get', 'put', 'delete'], url_path='course/(?P<course_id>[0-9]+)')
    def course_with_id(self, request, pk=None, course_id=None):
        if request.method == 'PUT':
            return self.update_course(request, pk=pk, course_id=course_id)
        elif request.method == 'DELETE':
            return self.remove_course(request, pk=pk, course_id=course_id)
        else:
            return self.get_course(request, pk=pk, course_id=course_id)

    def get_course(self, request, pk=None, course_id=None):
        user = User.objects.filter(id=pk)[0]
        course = Course.objects.filter(id=course_id)[0]
        studentcourse = StudentCourse.objects.filter(user=user).filter(course=course)
        serializer = []
        for s in studentcourse:
            serializer.append(StudentCourseSerializer(s).data)
        return response.Response(serializer)

    def update_course(self, request, pk=None, course_id=None):
        user = User.objects.filter(id=pk)[0]
        c = request.data['course'][0]
        course = Course.objects.filter(id=c.get("id"))[0]
        year = c.get("year")
        start_date = c.get("start_date")
        end_date = c.get("end_date")
        StudentCourse.objects.filter(user_id=pk).filter(course_id=course_id).update(course=course, user=user, year=year, start_date=start_date, end_date=end_date)

        studentcourse = StudentCourse.objects.filter(user=user).filter(course=course)
        serializer = []
        for s in studentcourse:
            serializer.append(StudentCourseSerializer(s).data)
        return response.Response(serializer)

    def remove_course(self, request, pk=None, course_id=None):
        StudentCourse.objects.filter(user_id=pk).filter(course_id=course_id).delete()
        return response.Response({"message": "Successfully Deleted Course From User"})

    @detail_route(methods=['get', 'post'], url_path='review')
    def review(self, request, pk=None):
        if request.method == 'POST':
            return self.add_review(request, pk=pk)
        else:
            return self.all_review(request, pk=pk)

    def all_review(self, request, pk=None):
        user = User.objects.filter(id=pk)[0]
        review = user.reviews.all()
        return response.Response(review.values())

    def add_review(self, request, pk=None):
        user = User.objects.filter(id=pk)[0]
        reviews = request.data['reviews']
        for r in reviews:
            rating = r.get("rating")
            comment = r.get("comment")
            reviewer = r.get("reviewer")
            type = r.get("type")
            reviewer_instance = User.objects.get(id=reviewer)
            r1 = Review(rating=rating, comment=comment, reviewer=reviewer_instance, type=type)
            r1.save()
            user.reviews.add(r1.id)

        return response.Response(user.reviews.all().values())

    @detail_route(methods=['get', 'put', 'delete'], url_path='review/(?P<review_id>[0-9]+)')
    def review_with_id(self, request, pk=None, review_id=None):
        if request.method == 'PUT':
            return self.update_review(request, pk=pk, review_id=review_id)
        elif request.method == 'DELETE':
            return self.remove_review(request, pk=pk, review_id=review_id)
        else:
            return self.get_review(request, pk=pk, review_id=review_id)

    def get_review(self, request, pk=None, review_id=None):
        user = User.objects.filter(id=pk)[0]
        reviews = user.reviews.all()
        data = []
        for r in reviews.values():
            if str(r['id']) == review_id:
                data.append(r)
        return response.Response(data)

    def update_review(self, request, pk=None, review_id=None):
        user = User.objects.filter(id=pk)[0]
        reviews = user.reviews.all()
        data = []
        for r in reviews:
            if str(r.id) == review_id:
                r.delete()
                review = request.data['reviews'][0]
                rating = review.get("rating")
                comment = review.get("comment")
                reviewer = review.get("reviewer")
                type = review.get("type")
                reviewer_instance = User.objects.get(id=reviewer)
                r1 = Review(rating=rating, comment=comment, reviewer=reviewer_instance, type=type)
                r1.save()
                user.reviews.add(r1.id)
                reviews = user.reviews.all()
                for r in reviews.values():
                    if r['id'] == r1.id:
                        data.append(r)
        return response.Response(data)

    def remove_review(self, request, pk=None, review_id=None):
        user = User.objects.filter(id=pk)[0]
        reviews = user.reviews.all()
        for r in reviews:
            if str(r.id) == review_id:
                r.delete()
        return response.Response({"message": "Successfully Deleted Review From User"})


class CollegeViewSet(viewsets.ModelViewSet):
    queryset = College.objects.all()
    serializer_class = CollegeSerializer

    @detail_route(methods=['get', 'post'], url_path='review')
    def review(self, request, pk=None):
        if request.method == 'POST':
            return self.add_review(request, pk=pk)
        else:
            return self.all_review(request, pk=pk)

    def all_review(self, request, pk=None):
        college = College.objects.filter(id=pk)[0]
        review = college.reviews.all()
        return response.Response(review.values())

    def add_review(self, request, pk=None):
        college = College.objects.filter(id=pk)[0]
        reviews = request.data['reviews']
        for r in reviews:
            rating = r.get("rating")
            comment = r.get("comment")
            reviewer = r.get("reviewer")
            type = r.get("type")
            reviewer_instance = User.objects.get(id=reviewer)
            r1 = Review(rating=rating, comment=comment, reviewer=reviewer_instance, type=type)
            r1.save()
            college.reviews.add(r1.id)

        return response.Response(college.reviews.all().values())

    @detail_route(methods=['get', 'put', 'delete'], url_path='review/(?P<review_id>[0-9]+)')
    def review_with_id(self, request, pk=None, review_id=None):
        if request.method == 'PUT':
            return self.update_review(request, pk=pk, review_id=review_id)
        elif request.method == 'DELETE':
            return self.remove_review(request, pk=pk, review_id=review_id)
        else:
            return self.get_review(request, pk=pk, review_id=review_id)

    def get_review(self, request, pk=None, review_id=None):
        college = College.objects.filter(id=pk)[0]
        reviews = college.reviews.all()
        data = []
        for r in reviews.values():
            if str(r['id']) == review_id:
                data.append(r)
        return response.Response(data)

    def update_review(self, request, pk=None, review_id=None):
        college = College.objects.filter(id=pk)[0]
        reviews = college.reviews.all()
        data = []
        for r in reviews:
            if str(r.id) == review_id:
                r.delete()
                review = request.data['reviews'][0]
                rating = review.get("rating")
                comment = review.get("comment")
                reviewer = review.get("reviewer")
                type = review.get("type")
                reviewer_instance = College.objects.get(id=reviewer)
                r1 = Review(rating=rating, comment=comment, reviewer=reviewer_instance, type=type)
                r1.save()
                college.reviews.add(r1.id)
                reviews = college.reviews.all()
                for r in reviews.values():
                    if r['id'] == r1.id:
                        data.append(r)
        return response.Response(data)

    def remove_review(self, request, pk=None, review_id=None):
        college = College.objects.filter(id=pk)[0]
        reviews = college.reviews.all()
        for r in reviews:
            if str(r.id) == review_id:
                r.delete()
        return response.Response({"message": "Successfully Deleted Review From College"})


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

    @detail_route(methods=['get', 'post'], url_path='review')
    def review(self, request, pk=None):
        if request.method == 'POST':
            return self.add_review(request, pk=pk)
        else:
            return self.all_review(request, pk=pk)

    def all_review(self, request, pk=None):
        course = Course.objects.filter(id=pk)[0]
        review = course.reviews.all()
        return response.Response(review.values())

    def add_review(self, request, pk=None):
        course = Course.objects.filter(id=pk)[0]
        reviews = request.data['reviews']
        for r in reviews:
            rating = r.get("rating")
            comment = r.get("comment")
            reviewer = r.get("reviewer")
            type = r.get("type")
            reviewer_instance = User.objects.get(id=reviewer)
            r1 = Review(rating=rating, comment=comment, reviewer=reviewer_instance, type=type)
            r1.save()
            course.reviews.add(r1.id)

        return response.Response(course.reviews.all().values())

    @detail_route(methods=['get', 'put', 'delete'], url_path='review/(?P<review_id>[0-9]+)')
    def review_with_id(self, request, pk=None, review_id=None):
        if request.method == 'PUT':
            return self.update_review(request, pk=pk, review_id=review_id)
        elif request.method == 'DELETE':
            return self.remove_review(request, pk=pk, review_id=review_id)
        else:
            return self.get_review(request, pk=pk, review_id=review_id)

    def get_review(self, request, pk=None, review_id=None):
        course = Course.objects.filter(id=pk)[0]
        reviews = course.reviews.all()
        data = []
        for r in reviews.values():
            if str(r['id']) == review_id:
                data.append(r)
        return response.Response(data)

    def update_review(self, request, pk=None, review_id=None):
        course = Course.objects.filter(id=pk)[0]
        reviews = course.reviews.all()
        data = []
        for r in reviews:
            if str(r.id) == review_id:
                r.delete()
                review = request.data['reviews'][0]
                rating = review.get("rating")
                comment = review.get("comment")
                reviewer = review.get("reviewer")
                type = review.get("type")
                reviewer_instance = Course.objects.get(id=reviewer)
                r1 = Review(rating=rating, comment=comment, reviewer=reviewer_instance, type=type)
                r1.save()
                course.reviews.add(r1.id)
                reviews = course.reviews.all()
                for r in reviews.values():
                    if r['id'] == r1.id:
                        data.append(r)
        return response.Response(data)

    def remove_review(self, request, pk=None, review_id=None):
        course = Course.objects.filter(id=pk)[0]
        reviews = course.reviews.all()
        for r in reviews:
            if str(r.id) == review_id:
                r.delete()
        return response.Response({"message": "Successfully Deleted Review From Course"})


class ReplyViewSet(viewsets.ModelViewSet):
    queryset = Reply.objects.all()
    serializer_class = ReplySerializer


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

