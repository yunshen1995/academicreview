function applyCollegeController($scope, $http, $mdDialog, $location) {

	$scope.check.mainpage = false;
	$scope.credentials = {};
	$scope.loginForm = {};

	$scope.submit = function() {
		if (!$scope.loginForm.$invalid) {
			$scope.applycollege($scope.credentials);
		}
	};

	$http.get('api/v1/collegeapplication/').then(function (response) {
	    console.log(response)
    });

	$scope.applycollege = function (credentials) {
	    credentials.courses = credentials.courses.data;
		$http.post('api/v1/collegeapplication/',credentials).then(function () {
			var alert = $mdDialog.alert()
				.title('Successfully Applied College')
				.textContent("Thanks for your application, the college will be verified by the administrator soon.")
				.ariaLabel('Lucky day')
				.ok('Confirm');
			$mdDialog.show(alert);
			$location.path('/');
		},function (err) {
			var msg = err.data.email[0];
			var alert = $mdDialog.alert()
				.title('Failed to Apply College')
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

module.exports = applyCollegeController;
