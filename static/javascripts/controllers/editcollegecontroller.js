function editCollegeController($scope, $http, $rootScope, $route, $location, $mdDialog) {

	$scope.check.mainpage = false;
	$scope.selected = {};

	$http.get('/college').then(function (data) {
		$scope.colleges = data.data;
	});

	$scope.showEditDelete = function () {
		if($rootScope.currentUser)
			return true;
		else
			return false;
	};

	$scope.editCollege = function (college) {
		$scope.selected = angular.copy(college);
	};

	$scope.updateCollege = function (college) {
		$http.put('/college/'+college._id,college).then(function () {
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
			$http.delete('/college/'+college._id).then(function () {
				$mdDialog.show(alert);
				$route.reload();
			});
		}, function() {

		});
	};

	$scope.getTemplate = function (review) {
		if (review._id === $scope.selected._id){
			return 'editcollege';
		}
		else {
			return 'displaycollege';
		}
	};

	$scope.reset = function () {
		$scope.selected = {};
	};

	$scope.add = function () {
		$location.path('/addcollege');
	};
}

module.exports = editCollegeController;