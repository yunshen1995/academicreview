function allCollegesController($scope, $http, $location, GoogleImageSearch) {

	$scope.check.mainpage = false;

	$scope.getFiltered= function(result, idx){
		result._index = idx;
		return !(result._index % 3 );
	};

	$http.get('/college').then(async function (data) {
		$scope.results = data.data;
		for(var i=0; i<$scope.results.length;i++){
			await GoogleImageSearch.searchImage($scope.results[i].name+' logo').then((res) => {
				$scope.results[i].image = res[0];
			});
		}
		var image = $scope.results[i].image; // eslint-disable-line no-unused-vars
	});

	$scope.go = function(college) {
		$location.path('/college/'+ college._id);
	};
}

module.exports = allCollegesController;