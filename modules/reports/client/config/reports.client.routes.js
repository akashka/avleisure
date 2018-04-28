(function () {
  'use strict';

  angular
    .module('reports.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('reports', {
        url: '/reports',
        templateUrl: '/modules/reports/client/views/reports.client.view.html',
        controller: 'ReportsController',
        controllerAs: 'vm'
      });
  }

}());
