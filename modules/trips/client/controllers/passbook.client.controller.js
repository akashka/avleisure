( function () {
	'use strict';
	angular.module('trips').controller('PassbookTripsAdminController', PassbookTripsAdminController);
	PassbookTripsAdminController.$inject = [ '$scope', '$state', '$window', 'tripResolve', 'Authentication', 'Notification', 'TripsService', 'ItineriesService', '$timeout','UsersService' ];

	function PassbookTripsAdminController( $scope, $state, $window, trip, Authentication, Notification, TripsService, ItineriesService, $timeout, UsersService ) {
		var vm = this;
		vm.trip = trip;
		vm.allTrips = TripsService.query();
		vm.itineries = ItineriesService.query();
		vm.authentication = Authentication;
		vm.users = UsersService.query();
		vm.balance = 0;

		$timeout(function() {
			if($state.params.tripId) {
				var allTrips = vm.allTrips;
				for(var i=0; i<allTrips.length; i++) {
					if(allTrips[i]._id == $state.params.tripId) {
						vm.trip = allTrips[i];
						for(var t=0; t<vm.trip.transactions.length; t++) {
							var sum = vm.balance;
							if(vm.trip.transactions[t].credit) 
								sum += Number(vm.trip.transactions[t].amount);
							else sum -= Number(vm.trip.transactions[t].amount);
							vm.balance = sum;
							vm.trip.transactions[t].balance = sum;
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
