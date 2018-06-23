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
        if(vm.international) {
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
        if(vm.south_india.length > 0 && vm.south_india[0] != "") {
            vm.itineries = [];
            for(var i=0; i<vm.allItineries.length; i++) {
                if(vm.south_india[0] == 'North India') {
                    var opt = _.map(vm.allItineries[i].sstate, function(o) {
                        if (o.id != 'Karnataka' && o.id != 'Tamil Nadu' && o.id != 'Andhra Pradesh' && o.id != 'Maharashtra' && o.id != 'Telangana' && o.id != 'Kerala' && o.id != 'Goa' && o.id != 'Puducherry') 
                            return o;
                    });
                    opt = _.compact(opt);
                    if(opt.length > 0) vm.itineries.push(vm.allItineries[i]);
                } else {
                    var opt = _.map(vm.allItineries[i].sstate, function(o) {
                        if (o.id == vm.south_india[0]) return o;
                    });
                    opt = _.compact(opt);
                    if(opt.length > 0) vm.itineries.push(vm.allItineries[i]);
                }
            }
        } else {
            vm.itineries = vm.allItineries;
        }
    }

  }
}());
