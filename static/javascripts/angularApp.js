/* Authentication https://medium.com/opinionated-angularjs/techniques-for-authentication-in-angularjs-applications-7bbf0346acec*/
require('../stylesheets/style.css');
require('angular');
require('angular-route');
require('angular-aria');
require('angular-animate');
require('angular-material');
require('angular-messages');
require('angular-sanitize');
require('angular-ui-bootstrap');
require('ngstorage');
require('angular-csrf-cross-domain');
require('angular-cookies');
require('moment');
require('angular-moment');
require('jquery');
require('skel-framework-npm');
require('./plugin/rating.js');
require('./plugin/wikipedia.js');
require('./jquery/jquery.dropotron.min.js');
require('./jquery/jquery.scrolly.min.js');
require('./jquery/jquery.scrollgress.min.js');
require('./jquery/util.js');
require('./jquery/main.js');

var app = angular.module('AcademicReview', ['ui.router', 'ngRoute', 'ngStorage', 'ui.bootstrap', 'ngMaterial',
    'ngMessages', 'ngSanitize', 'jkAngularRatingStars', 'jtt_wikipedia', 'angularMoment', 'csrf-cross-domain']);

require('./controllers/index');
require('./services/authentication');
require('./plugin/googleImage.js');

app.config(['$httpProvider', '$routeProvider', '$sceDelegateProvider', function ($httpProvider, $routeProvider, $sceDelegateProvider) {

    $routeProvider.when('/', {
        templateUrl: 'static/pages/main.ejs',
        controller: 'mainController'
    }).when('/college/search/:param', {
        templateUrl: 'static/pages/searchresult.ejs',
        controller: 'searchResultController'
    }).when('/signin', {
        templateUrl: 'static/pages/signin.ejs',
        controller: 'signInController'
    }).when('/signup', {
        templateUrl: 'static/pages/signup.ejs',
        controller: 'signUpController'
    }).when('/college/:param', {
        templateUrl: 'static/pages/collegemain.ejs',
        controller: 'collegeMainController'
    }).when('/colleges', {
        templateUrl: 'static/pages/allcolleges.ejs',
        controller: 'allCollegesController'
    }).when('/addcollege', {
        templateUrl: 'static/pages/addcollege.ejs',
        controller: 'addCollegeController'
    }).when('/editcollege', {
        templateUrl: 'static/pages/editcollege.ejs',
        controller: 'editCollegeController'
    }).when('/studentprofile', {
        templateUrl: 'static/pages/studentprofile.ejs',
        controller: 'studentProfileController'
    }).when('/verify-email/:key', {
        templateUrl: 'static/pages/verifyemail.ejs',
        controller: 'verifyEmailController'
    });

    $sceDelegateProvider.resourceUrlWhitelist(['self', 'https://en.wikipedia.org/**', 'https://www.google.com/']);

    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    $httpProvider.defaults.withCredentials = true;
}]);

app.run(authentication);
function authentication($rootScope, $http, $location, $localStorage) {
    // keep user logged in after page refresh
    if ($localStorage.currentUser) {
        $http.defaults.headers.common.Authorization = 'Bearer ' + $localStorage.currentUser.token;
    }

    // redirect to login page if not logged in and trying to access a restricted page
    // $rootScope.$on('$locationChangeStart', function (event, next, current) {
    //     var publicPages = ['/login'];
    //     var restrictedPage = publicPages.indexOf($location.path()) === -1;
    //     if (restrictedPage && !$localStorage.currentUser) {
    //         $location.path('/');
    //     }
    // });
}
