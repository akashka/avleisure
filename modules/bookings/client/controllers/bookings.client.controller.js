(function () {
  'use strict';

  angular
    .module('bookings')
    .controller('BookingsController', BookingsController);

  BookingsController.$inject = ['$scope', 'bookingResolve', 'Authentication', 'TripsService', '$timeout'];

  function BookingsController($scope, booking, Authentication, TripsService, $timeout) {
    var vm = this;

    vm.booking = booking;
    vm.authentication = Authentication;
    vm.trips = TripsService.query();

    $timeout(function() {
        vm.trip = _.find(vm.trips, function(o) { 
            return o.booking_id == vm.booking.booking_id; 
        });
        console.log(vm.trip);
    }, 1000);

  }
}());
