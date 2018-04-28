/* /public/modules/core/controllers/body.client.controller.js */
'use strict';

angular.module('core').controller('BodyController', ['$scope', 'Authentication',
    function($scope, Authentication) {
        $scope.topbarActive =  (window.location.pathname == '/authentication/signin') ? false : true;
}]);