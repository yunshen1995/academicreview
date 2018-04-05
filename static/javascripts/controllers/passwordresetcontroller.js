function passwordResetController($scope, $location, $http, $routeParams, $mdDialog) {

    $scope.check.mainpage = false;

    $scope.submit = function () {
        var passdetails = {
            "uid": $routeParams.uidb64,
            "token": $routeParams.token,
            "new_password1": $scope.new_password1,
            "new_password2": $scope.new_password2,
        };
        $http.post('api/v1/jwt/password/reset/confirm/',passdetails).then(function (response) {
            var alert = $mdDialog.alert()
				.title('Password Reset Successfully')
				.textContent(response.data.detail)
				.ariaLabel('Lucky day')
				.ok('Confirm');
			$mdDialog.show(alert);
			$location.path('/');
        },function (err) {
            var alert = $mdDialog.alert()
				.title('Password Reset Failed')
				.textContent(err.data)
				.ariaLabel('Lucky day')
				.ok('Confirm');
			$mdDialog.show(alert);
        });
    };
}

module.exports = passwordResetController;
