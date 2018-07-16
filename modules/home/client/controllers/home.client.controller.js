(function () {
  'use strict';

  angular
    .module('home')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$state', 'UsersService', 'TripsService', 'ItineriesService', 'BookingsService', 'EnquiriesService', 'Authentication'];

  function HomeController($state, UsersService, TripsService, ItineriesService, BookingsService, EnquiriesService, Authentication) {
    var vm = this;
    vm.authentication = Authentication;

    vm.trips = TripsService.query();
    // vm.users = UsersService.query();
    vm.itineries = ItineriesService.query();
    // vm.bookings = BookingsService.query();
    // vm.enquiries = EnquiriesService.query();

    UsersService.query(function (data) {
      vm.users = data;
    });

    EnquiriesService.query(function (data) {
      if(vm.authentication.user.roles[0] == 'admin')
        vm.enquiries = data;
      else {
        vm.enquiries = [];
        for(var d=0; d<data.length; d++) {
          for(var l=0; l<data[d].enquiry_by.length; l++) {
            if(data[d].enquiry_by[l]._id == vm.authentication.user._id) 
              vm.enquiries.push(data[d]);
          }
        }
      }
    });

    BookingsService.query(function (data) {
      if(vm.authentication.user.roles[0] == 'admin')
        vm.bookings = data;
      else {
        vm.bookings = [];
        for(var d=0; d<data.length; d++) {
          // if(data[d] == vm.authentication.user._id) vm.bookings.push(data[d]);
        }
      }
    });

    console.log(vm.authentication);

  }
}());
