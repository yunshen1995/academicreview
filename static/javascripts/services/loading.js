(function () {
    'use strict';
    var app = angular.module('AcademicReview');

    app.directive('loading', function () {
        return {
            restrict: 'E',
            replace:true,
            template: '<div class="loading" layout="row" layout-sm="column" layout-align="space-around"><md-progress-circular md-mode="indeterminate"></md-progress-circular></div>',
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
