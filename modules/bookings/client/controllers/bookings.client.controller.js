(function () {
  'use strict';

  angular
    .module('bookings')
    .controller('BookingsController', BookingsController);

  BookingsController.$inject = ['$scope', 'bookingResolve', 'Authentication', 'TripsService', '$timeout', 'ItineriesService'];

  function BookingsController($scope, booking, Authentication, TripsService, $timeout, ItineriesService) {
    var vm = this;

    vm.booking = booking;
    vm.authentication = Authentication;
    TripsService.query().$promise.then(function(response){
        vm.trips = response;
        vm.trip = _.find(vm.trips, function(o) { 
            return o.booking_id == vm.booking.booking_id; 
        });
    });
    vm.itineries = ItineriesService.query();

    vm.findDestination = function(_id) {
      for(var i=0; i<vm.itineries.length; i++) {
        if(vm.itineries[i]._id == _id)
          return vm.itineries[i].title;
      }
    }

    vm.calculateAmountPaid = function(amount_paid) {
      var sum = 0;
      for(var a=0; a<amount_paid.length; a++) {
        sum += Number(amount_paid[a].amount_paid);
      }
      return sum;
    }

    vm.calculateExpenses = function(expenses) {
      var sum = 0;
      for(var a=0; a<expenses.length; a++) {
        sum += Number(expenses[a].total_amount);
      }
      return sum;
    }

    vm.calculateTripExpenses = function(transactions) {
      var sum = 0;
      for(var a=0; a<transactions.length; a++) {
        if(transactions.credit) sum += transactions.amount;
        else sum -= Number(transactions[a].amount);
      }
      return sum;
    }

  }
}());
