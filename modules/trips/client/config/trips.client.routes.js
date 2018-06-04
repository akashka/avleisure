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
        url: '/:tripId/start',
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
        controller: 'EndTripsAdminController',
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
        controller: 'ExpensesTripsAdminController',
        controllerAs: 'vm',
        resolve: {
          tripResolve: getTrip
        },
        data: {
          pageTitle: '{{ tripResolve.title }}'
        }
      })
      .state('trips.add-balance', {
        url: '/:tripId/add-balance',
        templateUrl: '/modules/trips/client/views/add-balance.client.view.html',
        controller: 'BalanceTripsAdminController',
        controllerAs: 'vm',
        resolve: {
          tripResolve: getTrip
        },
        data: {
          pageTitle: '{{ tripResolve.title }}'
        }
      })
      .state('trips.view-passbook', {
        url: '/:tripId/passbook',
        templateUrl: '/modules/trips/client/views/view-passbook.client.view.html',
        controller: 'PassbookTripsAdminController',
        controllerAs: 'vm',
        resolve: {
          tripResolve: getTrip
        },
        data: {
          pageTitle: '{{ tripResolve.title }}'
        }
      })
      .state('trips.show-details', {
        url: '/:tripId/details',
        templateUrl: '/modules/trips/client/views/show-details.client.view.html',
        controller: 'DetailsTripsAdminController',
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
