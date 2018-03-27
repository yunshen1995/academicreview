function studentProfileController($scope, $http, $rootScope, $location, $route, $mdDialog, moment ) {

	$scope.check.mainpage = false;
	$scope.selected = {};
	$scope.genderopt = ['Male', 'Female','Not Disclose'];

	setTimeout(function () {
		$http.get('/student/'+$rootScope.currentUser.studentid).then(function (data) {
			$scope.student = data.data[0];
			if($scope.student.dob)
				$scope.student.dob = moment($scope.student.dob, moment.ISO_8601).format('YYYY-MM-DD');
		});

		$scope.getTemplate = function (student) {
			if (student._id === $scope.selected._id){
				return 'editstudent';
			}
			else {
				return 'displaystudent';
			}
		};
	},500);

	$scope.showEditDelete = function () {
		if($rootScope.currentUser)
			return true;
		else
			return false;
	};

	$scope.editStudent = function (student) {
		$scope.selected = angular.copy(student);
	};

	$scope.updateStudent = function (student) {
		$http.put('/student/'+student._id,student).then(function () {
			if(student.oldpassword && student.newpassword && student.reenterpassword){
				var password = {
					oldpassword: student.oldpassword,
					newpassword: student.newpassword,
					reenterpassword: student.reenterpassword
				};
				$http.put('/student/'+student._id+'/password',password).then(function () {
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
			.textContent('Are you sure you want to delete your account? This action cannot be undone.')
			.ariaLabel('Lucky day')
			.targetEvent(ev)
			.ok('Confirm')
			.cancel('Cancel');

		var alert = $mdDialog.alert()
			.title('Student Deleted')
			.ariaLabel('Lucky day')
			.ok('Confirm');

		$mdDialog.show(confirm).then(function() {
			$http.delete('/student/'+student._id).then(function () {
				$rootScope.logout();
				$location.path('/');
				$mdDialog.show(alert);
			});
		}, function() {

		});
	};

	$scope.reset = function () {
		$scope.selected = {};
	};
}

module.exports = studentProfileController;