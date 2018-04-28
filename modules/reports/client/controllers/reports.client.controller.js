(function () {
  'use strict';

  angular
    .module('reports')
    .controller('ReportsController', ReportsController);

  ReportsController.$inject = ['BookingsService','$state'];

  function ReportsController(BookingsService,$state) {
    var vm = this;
    vm.bookings = BookingsService.query();

  }
}());
