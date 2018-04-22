(function () {
  'use strict';

  angular
    .module('itineries')
    .controller('ItineriesListController', ItineriesListController);

  ItineriesListController.$inject = ['ItineriesService', '$filter'];

  function ItineriesListController(ItineriesService, $filter) {
    var vm = this;
    vm.allItineries = ItineriesService.query();
    vm.itineries = ItineriesService.query();
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;

    function figureOutItemsToDisplay() {
      vm.filteredItems = $filter('filter')(vm.allItineries, {
        $: vm.search
      });
      vm.filterLength = vm.filteredItems.length;
      vm.itineries = vm.filteredItems;
    }

  }
}());
