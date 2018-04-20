(function () {
  'use strict';

  angular
    .module('trips.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('trips', {
        abstract: true,
        url: '/trips',
        template: '<ui-view/>'
      })
      .state('trips.list', {
        url: '',
        templateUrl: '/modules/trips/client/views/list-trips.client.view.html',
        controller: 'TripsListController',
        controllerAs: 'vm'
      })
      .state('trips.start', {
        url: '/start',
        templateUrl: '/modules/trips/client/views/start-trip.client.view.html',
        controller: 'TripsAdminController',
        controllerAs: 'vm',
        resolve: {
          tripResolve: newTrip
        }
      })
      .state('trips.end', {
        url: '/:tripId/end',
        templateUrl: '/modules/trips/client/views/end-trip.client.view.html',
        controller: 'TripsAdminController',
        controllerAs: 'vm',
        resolve: {
          tripResolve: getTrip
        },
        data: {
          pageTitle: '{{ tripResolve.title }}'
        }
      })
      .state('trips.add-expenses', {
        url: '/:tripId/add-expenses',
        templateUrl: '/modules/trips/client/views/add-expenses.client.view.html',
        controller: 'TripsAdminController',
        controllerAs: 'vm',
        resolve: {
          tripResolve: getTrip
        },
        data: {
          pageTitle: '{{ tripResolve.title }}'
        }
      })
      .state('trips.view-passbook', {
        url: '/passbook',
        templateUrl: '/modules/trips/client/views/view-passbook.client.view.html',
        controller: 'TripsAdminController',
        controllerAs: 'vm',
        resolve: {
          tripResolve: getTrip
        },
        data: {
          pageTitle: '{{ tripResolve.title }}'
        }
      });
  }

  getTrip.$inject = ['$stateParams', 'TripsService'];

  function getTrip($stateParams, TripsService) {
    return TripsService.get({
      tripId: $stateParams.tripId
    });
  }

  newTrip.$inject = ['TripsService'];

  function newTrip(TripsService) {
    return new TripsService();
  }

}());
