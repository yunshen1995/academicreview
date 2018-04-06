function forgotPasswordController($scope, $location, $http, $routeParams, $mdDialog) {

    $scope.check.mainpage = false;

    $scope.submit = function () {
        $scope.loading = true;
        $http.post('api/v1/jwt/password/reset/',{'email':$scope.email}).then(function (response) {
            console.log(response)
            $scope.loading = false;
            var alert = $mdDialog.alert()
				.title('Password Reset Email Sent')
				.textContent(response.data.detail)
				.ariaLabel('Lucky day')
				.ok('Confirm');
			$mdDialog.show(alert);
			$location.path('/');
        },function (err) {
            $scope.loading = false;
            var alert = $mdDialog.alert()
				.title('Password Reset Failed')
				.textContent(err.data)
				.ariaLabel('Lucky day')
				.ok('Confirm');
			$mdDialog.show(alert);
        });
    };
}

module.exports = forgotPasswordController;
