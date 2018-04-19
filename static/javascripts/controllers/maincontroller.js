function mainController($scope, $location, $route, $localStorage, $rootScope, $window, $http, $mdDialog, $mdPanel, moment, AuthenticationService) {


    $scope.check = {};
    $scope.check.mainpage = true;
    $scope.currentUser = $localStorage.currentUser;
    $rootScope.currentUser = $localStorage.currentUser;
    $scope.$on('$locationChangeStart', function() {
        $scope.check.mainpage = true;
    });
    if($scope.currentUser){
        if($scope.currentUser.is_superuser) {
            $http.get('api/v1/notification/').then(function (response) {
                if(response.data){
                    if(response.data.application) {
                        for (var i=0;i<response.data.application.length;i++) {
                            response.data.application[i].applied = moment(response.data.application[i].applied, moment.ISO_8601).format('YYYY-MM-DD HH:mm');
                        }
                    }
                    if(response.data.report) {
                        for (var j=0;j<response.data.report.length;j++) {
                            response.data.report[j].reported = moment(response.data.report[j].reported, moment.ISO_8601).format('YYYY-MM-DD HH:mm')
                        }
                    }
                }
                $scope.application = response.data.application;
                $scope.report = response.data.report;
                $scope.badgecount = response.data.application.length + response.data.report.length;


                $scope.notification = {
                    name: 'notification'
                };

                $scope.menuTemplate = '' +
                    '<div ng-mouseleave="ctrl.closeMenu()" style="background-color: white;overflow: auto;height:400px; " class="menu-panel" md-whiteframe="6">' +
                    '  <div class="menu-content">' +
                    '       <md-content>' +
                    '           <md-list flex>' +
                    '               <md-list-item class="md-3-line" ng-repeat="item in ctrl.application" ng-click="ctrl.adminapp(item)" href="#!/adminpanel/app">\n' +
                    '                   <img ng-src="/static/images/icons/application.svg" class="md-avatar" alt="{{item.name}}" />\n' +
                    '                   <div class="md-list-item-text" layout="column">\n' +
                    '                       <h3 ng-bind="item.name"></h3>\n' +
                    '                       <h4 ng-bind="item.applied"></h4>\n' +
                    '                   </div>\n' +
                    '               </md-list-item>' +
                    '               <md-divider></md-divider>' +
                    '               <md-list-item class="md-3-line" ng-repeat="item in ctrl.report" ng-click="ctrl.adminreport(item)" href="#!/adminpanel/report">\n' +
                    '                   <img ng-src="/static/images/icons/flag.svg" class="md-avatar" alt="{{item.name}}" />\n' +
                    '                   <div class="md-list-item-text" layout="column">\n' +
                    '                       <h3 ng-bind="item.reason"></h3>\n' +
                    '                       <h4 ng-bind="item.reported"></h4>\n' +
                    '                   </div>\n' +
                    '               </md-list-item>' +
                    '           </md-list>' +
                    '       </md-content>'+
                    '  </div>' +
                    '</div>';

                $mdPanel.newPanelGroup('toolbar', {
                    maxOpen: 2
                });

                $mdPanel.newPanelGroup('menus', {
                    maxOpen: 3
                });

                $scope.showToolbarMenu = function($event, menu) {
                    var template = $scope.menuTemplate;

                    var position = $mdPanel.newPanelPosition()
                        .relativeTo($event.srcElement)
                        .addPanelPosition(
                            $mdPanel.xPosition.ALIGN_START,
                            $mdPanel.yPosition.BELOW
                        );

                    var config = {
                        id: 'toolbar_' + menu.name,
                        attachTo: angular.element(document.body),
                        controller: PanelMenuCtrl,
                        controllerAs: 'ctrl',
                        template: template,
                        position: position,
                        panelClass: 'menu-panel-container',
                        locals: {
                            items: menu.items
                        },
                        openFrom: $event,
                        focusOnOpen: false,
                        zIndex: 100,
                        propagateContainerEvents: true,
                        groupName: ['toolbar', 'menus']
                    };

                    $mdPanel.open(config);
                };

                function PanelMenuCtrl(mdPanelRef) {
                    this.closeMenu = function() {
                        mdPanelRef && mdPanelRef.close();
                    };
                    this.application =  $scope.application;
                    this.report = $scope.report;

                    this.adminapp = function (application) {
                        $http.patch('api/v1/collegeapplication/'+application.id+'/', {notification:false}).then(function () {
                            $http.get('api/v1/notification/').then(function (response) {
                                if(response.data){
                                    if(response.data.application) {
                                        for (var i=0;i<response.data.application.length;i++) {
                                            response.data.application[i].applied = moment(response.data.application[i].applied, moment.ISO_8601).format('YYYY-MM-DD HH:mm');
                                        }
                                    }
                                    if(response.data.report) {
                                        for (var j=0;j<response.data.report.length;j++) {
                                            response.data.report[j].reported = moment(response.data.report[j].reported, moment.ISO_8601).format('YYYY-MM-DD HH:mm')
                                        }
                                    }
                                }
                                $scope.application = response.data.application;
                                $scope.report = response.data.report;
                                $scope.badgecount = response.data.application.length + response.data.report.length;
                            });
                        });
                        mdPanelRef && mdPanelRef.close();
                    };
                    this.adminreport = function (report) {
                        $http.patch('api/v1/report/'+report.id+'/', {notification:false}).then(function () {
                            $http.get('api/v1/notification/').then(function (response) {
                                if(response.data){
                                    if(response.data.application) {
                                        for (var i=0;i<response.data.application.length;i++) {
                                            response.data.application[i].applied = moment(response.data.application[i].applied, moment.ISO_8601).format('YYYY-MM-DD HH:mm');
                                        }
                                    }
                                    if(response.data.report) {
                                        for (var j=0;j<response.data.report.length;j++) {
                                            response.data.report[j].reported = moment(response.data.report[j].reported, moment.ISO_8601).format('YYYY-MM-DD HH:mm')
                                        }
                                    }
                                }
                                $scope.application = response.data.application;
                                $scope.report = response.data.report;
                                $scope.badgecount = response.data.application.length + response.data.report.length;
                            });
                        });
                        mdPanelRef && mdPanelRef.close();
                    }
                }
            });
        }
    }
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
        if($scope.currentUser.is_superuser)
            $window.location.reload();
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
