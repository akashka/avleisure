( function () {
	'use strict';
	angular.module('trips').controller( 'ExpensesTripsAdminController', ExpensesTripsAdminController );
	ExpensesTripsAdminController.$inject = [ '$scope', '$state', '$window', 'tripResolve', 'Authentication', 'Notification', 'TripsService', 'ItineriesService', '$timeout','UsersService' ];

	function ExpensesTripsAdminController( $scope, $state, $window, trip, Authentication, Notification, TripsService, ItineriesService, $timeout, UsersService ) {
		var vm = this;
		vm.trip = trip;
		TripsService.query().$promise.then(function(response){
			vm.allTrips = response;
			if($state.params.tripId) {
				var allTrips = vm.allTrips;
				for(var i=0; i<allTrips.length; i++) {
					if(allTrips[i]._id == $state.params.tripId) {
						vm.trip = allTrips[i];
					}
				}
			}
			if (navigator.geolocation) {
				navigator.geolocation.watchPosition(showPosition);
			}
		});
		vm.itineries = ItineriesService.query();
		vm.authentication = Authentication;
		vm.users = UsersService.query();
		vm.form = {};
		vm.save = save;

		vm.expense = {
			category: "",
			amount: 0,
			credit: false,
			image: "",
			remarks: "",
			sub_category: "",
			location: "",
			transaction_date: new Date()
		};

		vm.findExecutiveName = function(executive_id) {
			for(var i=0; i<vm.users.length; i++) {
			if(vm.users[i]._id == executive_id) return vm.users[i].displayName;
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
		
		// Save Trip
		function save(transactionType) {
			vm.trip.transactions.push(vm.expense);
			// Create a new trip, or update the current instance
			TripsService.createOrUpdate(vm.trip).then( successCallback ).catch( errorCallback );
			function successCallback(res) {
				$state.go( 'trips.list' ); // should we send the User to the list or the updated trips view?
				Notification.success( {
					message: '<i class="glyphicon glyphicon-ok"></i> Trip saved successfully!'
				} );
			}
			function errorCallback( res ) {
				Notification.error( {
					message: res.data.message,
					title: '<i class="glyphicon glyphicon-remove"></i> Trips save error!'
				} );
			}
		}

		function showPosition(position) {
			vm.expense.location = position.coords.latitude + "," + position.coords.longitude; 
		}

	}
}() );
