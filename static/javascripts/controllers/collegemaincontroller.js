/*Review Edit Delete http://blog.shubhamsaxena.com/creating-simple-inline-editing-with-angularjs/*/
function collegeMainController($scope, $http, $rootScope, $route, $routeParams, $mdDialog, $location, GoogleImageSearch, wikipediaFactory, $sce, moment) {

    var gis = require('g-i-s');
    var Filter = require('bad-words');
    var filter = new Filter();
    $scope.check.mainpage = false;

    $scope.icon = '';
    $scope.readOnly = true;
    $scope.rating = 0;
    $scope.show = true;
    $scope.tab = true;
    $scope.wiki = 'No Information';
    $scope.selected = {};
    var collegeid = $routeParams.param;

    $scope.addreviewrating = 1;
    $scope.comment = '';
    $scope.profane = false;
    $scope.$watch('comment',function (newValue) {
        $scope.comment = filter.clean(newValue);
        $scope.profane = newValue.includes('***');
    });

    $scope.overviewtab = function () {
        $scope.tab = true;
        $scope.show = true;
    };

    $scope.reviewtab = function () {
        $scope.tab = false;
        $scope.show = false;
    };

    $scope.showEditDelete = function (studentid) {
        if($rootScope.currentUser)
            return $rootScope.currentUser.id === studentid;
        else
            return false;
    };

    $scope.editReview = function (review) {
        $scope.selected = angular.copy(review);
    };

    $scope.updateReview = function (review) {
        var reviewdetails = {
            "reviews": [{
                rating: review.rating,
                comment: review.comment,
                reviewer: review.reviewer_id,
                type: 'College'
            }]
        };
        $http.put('api/v1/colleges/'+ collegeid +'/review/'+review.id+'/',reviewdetails).then(function () {
            var alert = $mdDialog.alert()
                .title('Review Updated')
                .ariaLabel('Lucky day')
                .ok('Confirm');
            $mdDialog.show(alert);
            $route.reload();
        });
    };

    $scope.deleteReview = function (ev,review) {
        var confirm = $mdDialog.confirm()
            .title('Delete Review')
            .textContent('Would you like to delete review?')
            .ariaLabel('Lucky day')
            .targetEvent(ev)
            .ok('Confirm')
            .cancel('Cancel');

        var alert = $mdDialog.alert()
            .title('Review Deleted')
            .ariaLabel('Lucky day')
            .ok('Confirm');

        $mdDialog.show(confirm).then(function() {
            $http.delete('api/v1/colleges/'+ collegeid +'/review/'+review.id+'/').then(function () {
                $mdDialog.show(alert);
                $route.reload();
            });
        }, function() {

        });
    };

    $scope.getTemplate = function (review) {
        if (review.id === $scope.selected.id){
            return 'edit';
        }
        else {
            return 'display';
        }
    };

    $scope.reset = function () {
        $scope.selected = {};
    };

    $http.get('api/v1/colleges/'+ collegeid +'/review/').then(async function (data) {
        var reviews = data.data;
        var count = 0;
        if(reviews.length > 0){
            for(var i=0; i<reviews.length;i++){
                var review = reviews[i];
                review.date = moment(review.date, moment.ISO_8601).format('YYYY-MM-DD HH:mm');
                count += review.rating;
                await $http.get('api/v1/users/'+ review.reviewer_id+'/').then(function (data) {
                    review.reviewerName = data.data.first_name +' '+ data.data.last_name;
                });
            }
            $scope.rating = (count/reviews.length).toFixed(1);
            $scope.reviews = reviews;
        }
    });

    $http.get('api/v1/colleges/'+collegeid+'/').then(async function (data) {

        var college = data.data;
        $scope.college = college;

        await GoogleImageSearch.searchImage(college.name+' logo').then((res) => {
            $scope.icon = res[0];
        });

        wikipediaFactory.getArticle({
            term: college.name
        }).then(function (data) {
            $scope.wiki = $sce.trustAsHtml(data.data.query.pages[0].extract);
        });

        gis(college.name+' campus', logResults);
        function logResults(error, results) {
            if (error) {
                console.log(error);
            }
            else {
                var images = results;
                var imagepath;
                for(var i=0; i<images.length;i++){
                    if(images[i].width>1920){
                        imagepath = images[i].url;
                        break;
                    }
                }
                $scope.$apply(function () {
                    $scope.image= {
                        'background-image': 'url(\'stylesheets/images/light-bl.svg\'), url(\'stylesheets/images/light-br.svg\'), url(\'stylesheets/images/overlay.png\'), url(\''+ imagepath +'\')'
                    };
                });
            }
        }
    });

    $scope.addReview = function(){
        var reviewdetails = {
            "reviews": [{
                rating: $scope.addreviewrating,
                comment: $scope.comment,
                reviewer: $rootScope.currentUser.id,
                type: 'College'
            }]
        };
        if(reviewdetails.rating === 0){
            var alert = $mdDialog.alert()
                .title('Rate At Least 1 Star for Review')
                .ariaLabel('Lucky day')
                .ok('Confirm');
            $mdDialog.show(alert);
        }else if(reviewdetails.comment === ''){
            alert = $mdDialog.alert()
                .title('Comment is Required for Adding Review')
                .ariaLabel('Lucky day')
                .ok('Confirm');
            $mdDialog.show(alert);
        }else if($scope.profane){
            alert = $mdDialog.alert()
                .title('Profane words detected')
                .textContent('Please change the words being used before submit!')
                .ariaLabel('Lucky day')
                .ok('Confirm');
            $mdDialog.show(alert);
        }else{
            $http.post('api/v1/colleges/'+collegeid+'/review/',reviewdetails).then(function () {
                var alert = $mdDialog.alert()
                    .title('Review Added')
                    .ariaLabel('Lucky day')
                    .ok('Confirm');
                $mdDialog.show(alert);
                $route.reload();
            });
        }
    };

    $scope.image= {
        'background-image': 'url(\'stylesheets/images/light-bl.svg\'), url(\'stylesheets/images/light-br.svg\'), url(\'stylesheets/images/overlay.png\')'
    };
}

module.exports = collegeMainController;
