function searchResultController($scope, $http, $location , $routeParams, GoogleImageSearch) {

	$scope.check.mainpage = false;
	$scope.keyword = 'Search Result: '+ $routeParams.param;

	var params = {
		"keyword": $routeParams.param
	};

	$http.post('api/v1/colleges/search/',params).then(async function (data) {
		$scope.results = data.data;
		for(var i=0; i<$scope.results.length;i++){
			await GoogleImageSearch.searchImage($scope.results[i].name+' logo').then((res) => {
				$scope.results[i].image = res[0];
			});
		}
		var image = $scope.results[i].image; // eslint-disable-line no-unused-vars
	}, function () {
		$scope.keyword = 'Result Not Found, Please Try Again';
	});

	$scope.go = function(college) {
		$location.path('/college/'+ college._id);
	};
}

module.exports = searchResultController;
