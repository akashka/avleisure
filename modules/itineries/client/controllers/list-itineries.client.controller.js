(function () {
  'use strict';

  angular
    .module('itineries')
    .controller('ItineriesListController', ItineriesListController);

  ItineriesListController.$inject = ['ItineriesService'];

  function ItineriesListController(ItineriesService) {
    var vm = this;

    vm.itineries = ItineriesService.query();
  }
}());
