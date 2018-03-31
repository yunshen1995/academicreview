function addCollegeController($scope, $http, $mdDialog, $location) {

	$scope.check.mainpage = false;
	$scope.credentials = {};
	$scope.loginForm = {};
	$scope.credentials.reviews = [];

	$scope.submit = function() {
		if (!$scope.loginForm.$invalid) {
			$scope.addcollege($scope.credentials);
		}
	};

	$scope.addcollege = function (credentials) {
		$http.post('api/v1/colleges/',credentials).then(function () {
			var alert = $mdDialog.alert()
				.title('College Added')
				.ariaLabel('Lucky day')
				.ok('Confirm');
			$mdDialog.show(alert);
			$location.path('/');
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

	$scope.edit = function () {
		$location.path('/editcollege');
	};
}

module.exports = addCollegeController;
