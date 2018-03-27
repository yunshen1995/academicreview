function mainController($scope, $location, $localStorage, $rootScope, $window, $http, $mdDialog, AuthenticationService) {


    $scope.check = {};
    $scope.check.mainpage = true;
    $scope.currentUser = $localStorage.currentUser;
    $rootScope.currentUser = $localStorage.currentUser;
    $scope.$on('$locationChangeStart', function() {
        $scope.check.mainpage = true;
    });
    function search() {
        if ($scope.college.length > 0) {
            $location.path('/college/search/'+$scope.college);
        }
    }
    $scope.searchCollege = function () {
        search();
    };
    $scope.pressenter = function ($event) {
        if($event.keyCode === 13)
            search();
    };
    $scope.signin = function () {
        $location.path('/signin');
    };
    $scope.signup = function () {
        $location.path('/signup');
    };
    $scope.home = function () {
        if(!$scope.check.mainpage)
            $scope.check.mainpage = true;
    };
    $scope.logout = function () {
        AuthenticationService.Logout();
        $rootScope.$broadcast('logoutSuccess');
    };

    var backHomePage = function() {
		$window.location.reload();
	};

    var setCurrentUser = function(){
        $scope.currentUser = $localStorage.currentUser;
        $rootScope.currentUser = $localStorage.currentUser;
	};

    var showNotAuthorized = function(){
        var alert = $mdDialog.alert()
            .title('Not Authorized')
            .ariaLabel('Lucky day')
            .ok('Confirm');
        $mdDialog.show(alert);
    };

	$rootScope.$on('logoutSuccess', backHomePage);
	$rootScope.$on('loginSuccess', setCurrentUser);
}

module.exports = mainController;
