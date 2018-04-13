(function () {
  'use strict';

  angular
    .module('itineries.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('itineries', {
        abstract: true,
        url: '/itineries',
        template: '<ui-view/>'
      })
      .state('itineries.list', {
        url: '',
        templateUrl: '/modules/itineries/client/views/list-itineries.client.view.html',
        controller: 'ItineriesListController',
        controllerAs: 'vm'
      })
      .state('itineries.view', {
        url: '/:itineryId',
        templateUrl: '/modules/itineries/client/views/view-itinery.client.view.html',
        controller: 'ItineriesController',
        controllerAs: 'vm',
        resolve: {
          itineryResolve: getItinery
        },
        data: {
          pageTitle: '{{ itineryResolve.title }}'
        }
      })
      .state('itineries.create', {
        url: '/create',
        templateUrl: '/modules/itineries/client/views/form-itinery.client.view.html',
        controller: 'ItineriesAdminController',
        controllerAs: 'vm',
        resolve: {
          itineryResolve: newItinery
        }
      })
      .state('itineries.edit', {
        url: '/:itineryId/edit',
        templateUrl: '/modules/itineries/client/views/form-itinery.client.view.html',
        controller: 'ItineriesAdminController',
        controllerAs: 'vm',
        resolve: {
          itineryResolve: getItinery
        },
        data: {
          pageTitle: '{{ itineryResolve.title }}'
        }
      });
  }

  getItinery.$inject = ['$stateParams', 'ItineriesService'];

  function getItinery($stateParams, ItineriesService) {
    return ItineriesService.get({
      itineryId: $stateParams.itineryId
    });
  }

  newItinery.$inject = ['ItineriesService'];

  function newItinery(ItineriesService) {
    return new ItineriesService();
  }

}());