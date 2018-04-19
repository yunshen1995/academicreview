function adminPanelController($scope, $http, $timeout, $mdDialog, $route, moment, $routeParams, $rootScope) {

    $scope.check.mainpage = false;
    $scope.currentNavItem = 'page5';

    $http.get('api/v1/colleges/').then(function (data) {
        $scope.selected = {};
        $scope.colleges = data.data;

        $timeout(function () {
            angular.element(document).ready(function() {
                dTable = $('.datatable');
                dTable.DataTable();
            });
        }, 1000);

        $scope.showEditDelete = function () {
            return true;
        };

        $scope.editCollege = function (college) {
            $scope.selected = angular.copy(college);
        };

        $scope.updateCollege = function (college) {
            $http.put('api/v1/colleges/'+college.id+'/',college).then(function () {
                var alert = $mdDialog.alert()
                    .title('College Updated')
                    .ariaLabel('Lucky day')
                    .ok('Confirm');
                $mdDialog.show(alert);
                $route.reload();
            });
        };

        $scope.deleteCollege = function (ev,college) {
            var confirm = $mdDialog.confirm()
                .title('Delete College')
                .textContent('Would you like to delete college?')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Confirm')
                .cancel('Cancel');

            var alert = $mdDialog.alert()
                .title('College Deleted')
                .ariaLabel('Lucky day')
                .ok('Confirm');

            $mdDialog.show(confirm).then(function() {
                $http.delete('api/v1/colleges/'+college.id+'/').then(function () {
                    $mdDialog.show(alert);
                    $route.reload();
                });
            }, function() {

            });
        };

        $scope.getCollegeTemplate = function (college) {
            if (college.id === $scope.selected.id){
                return 'editcollegeadmin';
            }
            else {
                return 'displaycollegeadmin';
            }
        };

    });

    $http.get('api/v1/users/').then(function (data) {
        $scope.students = data.data;

        for(i=0;i<$scope.students.length;i++){
            if($scope.students[i].dob)
                $scope.students[i].dob = moment($scope.students[i].dob, moment.ISO_8601).format('YYYY-MM-DD');
        }


        $scope.getStudentTemplate = function (student) {
            if (student.id === $scope.selected.id){
                return 'editstudentadmin';
            }
            else {
                return 'displaystudentadmin';
            }
        };

        $scope.showEditDelete = function () {
            return true;
        };

        $scope.editStudent = function (student) {
            $scope.selected = angular.copy(student);
        };

        $scope.updateStudent = function (student) {
            if(student.dob)
                student.dob = moment(student.dob, moment.ISO_8601).format('YYYY-MM-DD');
            $http.put('api/v1/users/'+student.id+'/',student).then(function () {
                if(student.oldpassword && student.newpassword && student.reenterpassword){
                    var password = {
                        oldpassword: student.oldpassword,
                        new_password1: student.newpassword,
                        new_password2: student.reenterpassword
                    };
                    $http.post('api/v1/jwt/password/change/',password).then(function () {
                        var alert = $mdDialog.alert()
                            .title('Student Details and Password Updated')
                            .ariaLabel('Lucky day')
                            .ok('Confirm');
                        $mdDialog.show(alert);
                        $route.reload();
                    },function (err) {
                        var alert = $mdDialog.alert()
                            .title('Edit Password Error')
                            .textContent(err.data.message)
                            .ariaLabel('Lucky day')
                            .ok('Confirm');
                        $mdDialog.show(alert);
                    });
                }else{
                    var alert = $mdDialog.alert()
                        .title('Student Details Updated')
                        .ariaLabel('Lucky day')
                        .ok('Confirm');
                    $mdDialog.show(alert);
                    $route.reload();
                }
            });
        };

        $scope.deleteStudent = function (ev,student) {
            var confirm = $mdDialog.confirm()
                .title('Delete Student Account')
                .textContent('Are you sure you want to delete this account? This action cannot be undone.')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Confirm')
                .cancel('Cancel');

            var alert = $mdDialog.alert()
                .title('Student Deleted')
                .ariaLabel('Lucky day')
                .ok('Confirm');

            $mdDialog.show(confirm).then(function() {
                $http.delete('api/v1/users/'+student.id+'/').then(function () {
                    $mdDialog.show(alert);
                    $route.reload();
                });
            }, function() {

            });
        };
    });

    $http.get('api/v1/applicationreport/').then(function (response) {
        if (response.data) {
            if (response.data.application) {
                for (var i = 0; i < response.data.application.length; i++) {
                    response.data.application[i].applied = moment(response.data.application[i].applied, moment.ISO_8601).format('YYYY-MM-DD HH:mm');
                    response.data.application[i].solved = response.data.application[i].solved ? 'Yes' : 'No';
                    response.data.application[i].coursesName = response.data.application[i].courses ? 'Link' : '-'
                }
            }
            if (response.data.report) {
                for (var j = 0; j < response.data.report.length; j++) {
                    response.data.report[j].reported = moment(response.data.report[j].reported, moment.ISO_8601).format('YYYY-MM-DD HH:mm');
                    response.data.report[j].solved = response.data.report[j].solved ? 'Yes' : 'No';
                }
            }
        }

        $scope.applications = response.data.application;
        $scope.reports = response.data.report;

        $scope.getReportTemplate = function (report) {
            if (report.id === $scope.selected.id){
                return 'editreportadmin';
            }
            else {
                return 'displayreportadmin';
            }
        };

        $scope.reviewtab = function () {
            $scope.tab = false;
            $scope.show = false;
        };

        $scope.showDelete = function (studentid) {
            return true;
        };

        $scope.editReview = function (review) {
            $scope.selected = angular.copy(review);
        };

        $scope.checkReview = async function(report){
            await $http.get('api/v1/reviews/'+ report.review +'/').then(async function (data) {
                var review = data.data;
                review.replytxt = '';
                review.date = moment(review.date, moment.ISO_8601).format('YYYY-MM-DD HH:mm');
                await $http.get('api/v1/reviews/'+ review.id +'/replies/').then(async function (data) {
                    review.replies = data.data;
                    for(var i=0; i<review.replies.length;i++){
                        var reply = review.replies[i];
                        reply.date = moment(reply.date, moment.ISO_8601).format('YYYY-MM-DD HH:mm');
                        await $http.get('api/v1/users/'+ reply.replier_id+'/').then(function (data) {
                            reply.replierName = data.data.first_name +' '+ data.data.last_name;
                        });
                    }
                });
                await $http.get('api/v1/users/'+ review.reviewer+'/').then(function (data) {
                    review.reviewerName = data.data.first_name +' '+ data.data.last_name;
                });
                $scope.review = review;

                $scope.review.showreply = function(){
                    $scope.review.showreplycheck = !$scope.review.showreplycheck;
                };

                $scope.getReviewTemplate = function (review) {
                    if (review.id === $scope.selected.id){
                        return 'edit';
                    }
                    else {
                        return 'display';
                    }
                };
            });
            $scope.reporttemp = report;
            $scope.selected = angular.copy(report);
        };

        $scope.updateReview = function (review) {
            var reviewdetails = {
                "reviews": [{
                    rating: review.rating,
                    comment: review.comment,
                    reviewer: review.reviewer_id,
                    type: 'College'
                }]
            };
            $http.put('api/v1/reviews/'+ review.id +'/',reviewdetails).then(function () {
                var alert = $mdDialog.alert()
                    .title('Review Updated')
                    .ariaLabel('Lucky day')
                    .ok('Confirm');
                $mdDialog.show(alert);
                $route.reload();
            });
        };

        $scope.deleteReview = function (ev,review) {
            var confirm = $mdDialog.confirm()
                .title('Delete Review')
                .textContent('Would you like to delete review?')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Confirm')
                .cancel('Cancel');

            var alert = $mdDialog.alert()
                .title('Review Deleted')
                .ariaLabel('Lucky day')
                .ok('Confirm');

            $mdDialog.show(confirm).then(function() {
                $http.delete('api/v1/report/'+ $scope.reporttemp.id +'/').then(function () {
                    $http.delete('api/v1/reviews/'+ review.id +'/').then(function () {
                        $mdDialog.show(alert);
                        $route.reload();
                    });
                });
            }, function() {

            });
        };

        $scope.reportReview = function (ev,review) {
            if($rootScope.currentUser){
                $scope.reporter = $rootScope.currentUser.id
            }else{
                $scope.reporter = null
            }
            var confirm = $mdDialog.show({
                controller: DialogController,
                templateUrl: 'static/pages/reportradio.ejs',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true
            }).then(function(answer) {
                var report = {
                    review: review.id,
                    reporter: $scope.reporter,
                    reason: answer
                };
                $http.post('api/v1/report/',report).then(function () {
                    $mdDialog.show(alert);
                });
            }, function() {

            });

            function DialogController($scope, $mdDialog) {
                $scope.hide = function() {
                    $mdDialog.hide();
                };
                $scope.cancel = function() {
                    $mdDialog.cancel();
                };
                $scope.answer = function(answer) {
                    $mdDialog.hide(answer);
                };
            }

            var alert = $mdDialog.alert()
                .title('Thank you for reporting')
                .htmlContent('<p>Thank you for taking time to report the review. <br> Our team will inspect the review and handle it as soon as possible.</p>')
                .ariaLabel('Lucky day')
                .ok('Confirm');
        };

        $scope.addReply = function(reviewid, reply){
            var replydetails = {
                review: reviewid,
                comment: reply,
                replier: $rootScope.currentUser.id
            };
            $http.post('api/v1/replies/',replydetails).then(function () {
                var alert = $mdDialog.alert()
                    .title('Reply Added')
                    .ariaLabel('Lucky day')
                    .ok('Confirm');
                $mdDialog.show(alert);
                $route.reload();
            });
        };

        $scope.deleteReply = function (ev,reply) {
            var confirm = $mdDialog.confirm()
                .title('Delete Reply')
                .textContent('Would you like to delete reply?')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Confirm')
                .cancel('Cancel');

            var alert = $mdDialog.alert()
                .title('Reply Deleted')
                .ariaLabel('Lucky day')
                .ok('Confirm');

            $mdDialog.show(confirm).then(function() {
                $http.delete('api/v1/replies/'+reply.id+'/').then(function () {
                    $mdDialog.show(alert);
                    $route.reload();
                });
            }, function() {

            });
        };

        $scope.showApproveReject = function (application) {
            return application.status !== 'Approved'
        };

        $scope.approveApplication = function (application) {
            var confirm = $mdDialog.confirm()
                .title('Approve College Application')
                .textContent('Are you sure you want to approve this college application?')
                .ariaLabel('Lucky day')
                .ok('Confirm')
                .cancel('Cancel');

            var alert = $mdDialog.alert()
                .title('College Approved')
                .ariaLabel('Lucky day')
                .ok('Confirm');

            var collegeapp = {
                name : application.name,
                email: application.email,
                address: application.address,
                contact_number: application.contact_number,
                reviews: []
            };

            $mdDialog.show(confirm).then(function() {
                $http.post('api/v1/colleges/',collegeapp).then(function () {
                    $http.patch('api/v1/collegeapplication/'+application.id+'/', {solved:true, status:'Approved'}).then(function () {
                        $mdDialog.show(alert);
                        $route.reload();
                    });
                });
            },function (err) {
                var msg = err.data.email[0];
                var alert = $mdDialog.alert()
                    .title('Failed to Add College')
                    .textContent(msg)
                    .ariaLabel('Lucky day')
                    .ok('Confirm');
                $mdDialog.show(alert);
            });
        };

        $scope.rejectApplication = function (application) {
            var confirm = $mdDialog.confirm()
                .title('Reject College Application')
                .textContent('Are you sure you want to reject this college application?')
                .ariaLabel('Lucky day')
                .ok('Confirm')
                .cancel('Cancel');

            var alert = $mdDialog.alert()
                .title('College Rejected')
                .ariaLabel('Lucky day')
                .ok('Confirm');

            $mdDialog.show(confirm).then(function() {
                $http.patch('api/v1/collegeapplication/'+application.id+'/', {solved:true, status:'Rejected'}).then(function () {
                    $mdDialog.show(alert);
                    $route.reload();
                });
            }, function() {

            });
        };

        $scope.deleteApplication = function (ev,application) {
            var confirm = $mdDialog.confirm()
                .title('Delete College Application')
                .textContent('Are you sure you want to delete this college application?')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Confirm')
                .cancel('Cancel');

            var alert = $mdDialog.alert()
                .title('Student Deleted')
                .ariaLabel('Lucky day')
                .ok('Confirm');

            $mdDialog.show(confirm).then(function() {
                $http.delete('api/v1/collegeapplication/'+application.id+'/').then(function () {
                    $mdDialog.show(alert);
                    $route.reload();
                });
            }, function() {

            });
        };
    });

    if($routeParams.param === 'app'){
        $scope.activeapplication = true;
    }else if($routeParams.param === 'report'){
        $scope.activereport = true;
    }

    $scope.reset = function () {
        $scope.selected = {};
    };
}

module.exports = adminPanelController;
