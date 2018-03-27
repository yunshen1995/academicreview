function signUpController($scope, $http, $rootScope, $location, $mdDialog) {

	$scope.check.mainpage = false;

	$scope.signin = function () {
		$location.path('/signin');
	};

	if($rootScope.currentUser){
		$scope.check.mainpage = true;
		$location.path('/');
	}

	$scope.submit = function() {
		if (!$scope.loginForm.$invalid && $scope.credentials.password === $scope.credentials.confirm_password) {
			$scope.credentials.name = $scope.credentials.first_name + ' '+$scope.credentials.last_name;
			$scope.register($scope.credentials);
		} else {
			var alert = $mdDialog.alert()
				.title('Invalid Password')
				.textContent('Password not equal')
				.ariaLabel('Lucky day')
				.ok('Confirm');
			$mdDialog.show(alert);
		}
	};

	$scope.register = function(credentials) {
		$http.post('/api/v1/registration',credentials).then(function (response) {
			var alert = $mdDialog.alert()
				.title('Register Successfully')
				.textContent(response.data.detail)
				.ariaLabel('Lucky day')
				.ok('Confirm');
			$mdDialog.show(alert);
			$location.path('/signin');
		},function (err) {
			var msg = 'Error: ';
			if(err.data.email)
				msg += err.data.email;
			if(err.data.username)
				msg += '\n'+err.data.username;
			if(err.data.non_field_errors)
				msg += '\n'+err.data.non_field_errors;
			var alert = $mdDialog.alert()
				.title('Registration Failed')
				.textContent(msg)
				.ariaLabel('Lucky day')
				.ok('Confirm');
			$mdDialog.show(alert);
		});
	};
}

module.exports = signUpController;
