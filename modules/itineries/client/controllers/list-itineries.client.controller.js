(function () {
  'use strict';

  angular
    .module('itineries')
    .controller('ItineriesListController', ItineriesListController);

  ItineriesListController.$inject = ['ItineriesService', '$filter', 'Authentication'];

  function ItineriesListController(ItineriesService, $filter, Authentication) {
    var vm = this;
    vm.allItineries = ItineriesService.query();
    vm.itineries = ItineriesService.query();
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.authentication = Authentication;

    vm.isUserAdmin = vm.authentication.user.roles.includes('admin');

    function figureOutItemsToDisplay() {
      vm.filteredItems = $filter('filter')(vm.allItineries, {
        $: vm.search
      });
      vm.filterLength = vm.filteredItems.length;
      vm.itineries = vm.filteredItems;
    }

    vm.resort_package = false;
    vm.day_returns = false;
    vm.international = false;
    vm.island = false;
    vm.south_india = '';

    vm.resortPackage = function() {
        vm.day_returns = false;
        vm.international = false;
        vm.island = false;
        vm.south_india = '';
        if(vm.resort_package) {
            vm.itineries = [];
            for(var i=0; i<vm.allItineries.length; i++) {
                if(vm.allItineries[i].package_type == 'Resort Package') vm.itineries.push(vm.allItineries[i]);
            }
        } else {
            vm.itineries = vm.allItineries;
        }
    }

    vm.dayReturns = function() {
        vm.resort_package = false;
        vm.international = false;
        vm.island = false;
        vm.south_india = '';
        if(vm.day_returns) {
            vm.itineries = [];
            for(var i=0; i<vm.allItineries.length; i++) {
                if(vm.allItineries[i].package_type == 'Day Return Package') vm.itineries.push(vm.allItineries[i]);
            }
        } else {
            vm.itineries = vm.allItineries;
        }
    }

    vm.internationals = function() {
        vm.resort_package = false;
        vm.day_returns = false;
        vm.island = false;
        vm.south_india = '';
        if(vm.day_returns) {
            vm.itineries = [];
            for(var i=0; i<vm.allItineries.length; i++) {
                if(vm.allItineries[i].international != 'India') vm.itineries.push(vm.allItineries[i]);
            }
        } else {
            vm.itineries = vm.allItineries;
        }
    }

    vm.islands = function() {
        vm.resort_package = false;
        vm.day_returns = false;
        vm.international = false;
        vm.south_india = '';
        // if(vm.day_returns) {
        //     vm.itineries = [];
        //     for(var i=0; i<vm.allItineries.length; i++) {
        //         if(vm.allItineries[i].international != 'India') vm.itineries.push(vm.allItineries[i]);
        //     }
        // } else {
            vm.itineries = vm.allItineries;
        // }
    }

    vm.southIndia = function() {
        vm.resort_package = false;
        vm.day_returns = false;
        vm.international = false;
        vm.island = false;
        if(vm.south_india[0] != "") {
            vm.itineries = [];
            for(var i=0; i<vm.allItineries.length; i++) {
                if(vm.south_india[0] == 'North India' && _.indexOf(vm.allItineries[i].sstate, 'Karnataka') == -1 
                  && _.indexOf(vm.allItineries[i].sstate, 'Tamil Nadu') == -1 && _.indexOf(vm.allItineries[i].sstate, 'Andhra Pradesh') == -1
                  && _.indexOf(vm.allItineries[i].sstate, 'Telangana') == -1 && _.indexOf(vm.allItineries[i].sstate, 'Maharashtra') == -1
                  && _.indexOf(vm.allItineries[i].sstate, 'Kerala') == -1)  vm.itineries.push(vm.allItineries[i]);
                else if(_.indexOf(vm.allItineries[i].sstate, vm.south_india[0]) > -1) vm.itineries.push(vm.allItineries[i]);
            }
        } else {
            vm.itineries = vm.allItineries;
        }
    }

  }
}());
