function signInController($scope, $location, AuthenticationService, $mdDialog) {

    $scope.check.mainpage = false;
    $scope.credentials = {};
    $scope.loginForm = {};

    $scope.submit = function() {
        if (!$scope.loginForm.$invalid) {
            $scope.login($scope.credentials);
        }
    };

    initController();

    function initController() {
        // reset login status
        AuthenticationService.Logout();
    }

    $scope.login = function(credentials) {
        AuthenticationService.Login(credentials.username, credentials.password, function (result, message) {
            if (result === true) {
                if (!$scope.check.mainpage)
                    $scope.check.mainpage = true;
                $location.path('/');
            } else {
                var alert = $mdDialog.alert()
                    .title('Error')
				    .textContent(message.data.non_field_errors[0])
                    .ariaLabel('Lucky day')
                    .ok('Confirm');
                $mdDialog.show(alert);
            }
        });
    };

    $scope.signup = function () {
        $location.path('/signup');
    };
}

module.exports = signInController;
