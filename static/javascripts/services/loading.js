(function () {
    'use strict';
    var app = angular.module('AcademicReview');

    app.directive('loading', function () {
        return {
            restrict: 'E',
            replace:true,
            template: '<div class="loading"><img src="http://www.nasa.gov/multimedia/videogallery/ajax-loader.gif" width="50" height="50" /></div>',
            link: function (scope, element, attr) {
                scope.$watch('loading', function (val) {
                    if (val)
                        $(element).show();
                    else
                        $(element).hide();
                });
            }
        }
    })
})();
