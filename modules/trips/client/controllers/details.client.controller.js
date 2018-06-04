( function () {
	'use strict';
	angular.module('trips').controller('DetailsTripsAdminController', DetailsTripsAdminController);
	DetailsTripsAdminController.$inject = [ '$scope', '$state', '$window', 'tripResolve', 'Authentication', 'Notification', 'TripsService', 'ItineriesService', '$timeout', 'UsersService', 'BookingsService' ];

	function DetailsTripsAdminController( $scope, $state, $window, trip, Authentication, Notification, TripsService, ItineriesService, $timeout, UsersService, BookingsService ) {
		var vm = this;
		vm.trip = trip;
		vm.allTrips = TripsService.query();
		vm.itineries = ItineriesService.query();
		vm.bookings = BookingsService.query();
		vm.authentication = Authentication;
		vm.users = UsersService.query();
		vm.balance = 0;

		$timeout(function() {
			if($state.params.tripId) {
				var allTrips = vm.allTrips;
				for(var i=0; i<allTrips.length; i++) {
					if(allTrips[i]._id == $state.params.tripId) {
						vm.trip = allTrips[i];
						for(var b = 0; b < vm.bookings.length; b++) {
							if(vm.bookings[b].booking_id == vm.trip.booking_id) vm.booking = vm.bookings[b];
						}
						for(var b = 0; b < vm.itineries.length; b++) {
							if(vm.itineries[b]._id == vm.booking.destination) vm.itinery = vm.itineries[b];
						}
					}
				}
			}
		}, 1000);

		vm.findExecutiveName = function(executive_id) {
			for(var i=0; i<vm.users.length; i++) {
			if(vm.users[i]._id == executive_id) return vm.users[i].displayName;
			}
		}

		vm.findExecutive = function(executive_id) {
			for(var i=0; i<vm.users.length; i++) {
			if(vm.users[i].email == executive_id) return vm.users[i].displayName;
			}
		}

		vm.findTripStatus = function(trip) {
			if(trip.trip_end_date != undefined && trip.trip_end_date != null && trip.trip_end_date != ""
			&& trip.trip_end_by != undefined && trip.trip_end_by != null && trip.trip_end_by != "")
			return "Completed";
			return "Ongoing";
		}

		vm.calculateBalance = function(transactions) {
        	var sum = 0;
			for(var i=0; i<transactions.length; i++) {
			if(transactions[i].credit) sum += Number(transactions[i].amount);
			else sum -= Number(transactions[i].amount);
			}
			return sum;
		}

	}
}() );
