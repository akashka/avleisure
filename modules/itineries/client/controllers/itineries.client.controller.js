(function () {
  'use strict';

  angular
    .module('itineries')
    .controller('ItineriesController', ItineriesController);

  ItineriesController.$inject = ['$scope', 'itineryResolve', 'Authentication'];

  function ItineriesController($scope, itinery, Authentication) {
    var vm = this;

    vm.itinery = itinery;
    vm.authentication = Authentication;

  }
}());
