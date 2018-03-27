function verifyEmailController($scope, $location, $http, $routeParams) {

    $scope.check.mainpage = false;
    $http.get('api/v1/account-confirm-email/'+$routeParams.key+'/').then(function (response) {
        console.log(response)
    });
    $scope.signin = function () {
        $location.path('/signin');
    };
}

module.exports = verifyEmailController;
