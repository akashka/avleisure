(function () {
  'use strict';

  angular
    .module('home')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$state', 'UsersService', 'TripsService', 'ItineriesService', 'BookingsService', 'EnquiriesService'];

  function HomeController($state, UsersService, TripsService, ItineriesService, BookingsService, EnquiriesService) {
    var vm = this;

    vm.trips = TripsService.query();
    vm.users = UsersService.query();
    vm.itineries = ItineriesService.query();
    vm.bookings = BookingsService.query();
    vm.enquiries = EnquiriesService.query();

  }
}());
