(function () {
    'use strict';

    var app = angular.module('AcademicReview');
    app.factory('AuthenticationService', Service);

    app.config(function ($provide, $httpProvider) {
        $provide.factory('unauthorisedInterceptor', ['$q', function ($q) {
            return {
                'responseError': function (rejection) {
                    if (rejection.status === 401) {
                        window.location.href = '/#/login';
                    }

                    return $q.reject(rejection);
                }
            };
        }]);
        $httpProvider.interceptors.push('unauthorisedInterceptor');
    });

    function Service($http, $localStorage, $rootScope) {
        var service = {};

        service.Login = Login;
        service.Logout = Logout;

        return service;

        function Login(username, password, callback) {
            $http.post('/api/v1/jwt/login/', { username: username, password: password })
                .then(function (response) {
                    // login successful if there's a token in the response
                    if (response.data.token) {
                        // store username and token in local storage to keep user logged in between page refreshes
                        $http.get('api/v1/users/'+response.data.user.pk+'/').then(function (data) {
                            $localStorage.currentUser = { id: response.data.user.pk,username: username, token: response.data.token,
                                first_name:response.data.user.first_name, last_name:response.data.user.last_name, is_superuser: data.data.is_superuser};
                            $rootScope.$broadcast('loginSuccess');

                            // add jwt token to auth header for all requests made by the $http service
                            $http.defaults.headers.common.Authorization = 'JWT ' + response.data.token;

                            // execute callback with true to indicate successful login
                            callback(true, "Login Successfully");
                        });
                    } else {
                        // execute callback with false to indicate failed login
                        callback(false, "Login Error");
                    }
                }).catch(function (error) {
                callback(false, error);
            });
        }

        function Logout() {
            // remove user from local storage and clear http auth header
            delete $localStorage.currentUser;
            $http.defaults.headers.common.Authorization = '';
        }
    }
})();
