( function () {
	'use strict';
	angular.module( 'trips' ).controller( 'TripsAdminController', TripsAdminController );
	TripsAdminController.$inject = [ '$scope', '$state', '$window', 'tripResolve', 'Authentication', 'Notification', 'TripsService', 'ItineriesService', '$timeout','UsersService' ];

	function TripsAdminController( $scope, $state, $window, trip, Authentication, Notification, TripsService, ItineriesService, $timeout,UsersService ) {
		var vm = this;
		vm.trip = trip;
		vm.allTrips = TripsService.query();
		vm.itineries = ItineriesService.query();
		vm.authentication = Authentication;
		vm.users = UsersService.query();
		vm.form = {};
		vm.remove = remove;
		vm.save = save;
		vm.rmTrip  = rmTrip;
		vm.updateTransactions = updateTransactions;
		vm.amount = '';

		$timeout( function(){
			if($state.params.tripId) {
				var allTrips = (vm.allTrips);
				for(var i=0; i<allTrips.length; i++) {
					if(allTrips[i]._id == $state.params.tripId) {
						vm.trip = allTrips[i];
					}
				}
			}
		}, 1000 );

		vm.selectDate = function ( $event, num ) {
			if ( num == 1 ) {
				vm.dateset.lr_date.isOpened = true;
			}
		};
		vm.dateOptions = {
			formatYear: 'yy',
			maxDate: new Date( 2030, 5, 22 ),
			minDate: new Date( 1920, 5, 22 ),
			startingDay: 1
		};
		vm.dateset = {
			lr_date: {
				isOpened: false
			},
		};

		// Remove existing trip
		function remove() {
			if ( $window.confirm( 'Are you sure you want to delete?' ) ) {
				vm.trip.$remove( function () {
					$state.go( 'trips.list' );
					Notification.success( {
						message: '<i class="glyphicon glyphicon-ok"></i> Trip deleted successfully!'
					} );
				} );
			}
		}

		// Save Trip
		function save(transactionType) {
			// Create a new trip, or update the current instance
			if(vm.trip.trip_id == "") vm.trip.trip_id = ("TRIP" + vm.allTrips.length);
			vm.updateTransactions(transactionType);
			TripsService.createOrUpdate(vm.trip).then( successCallback ).catch( errorCallback );

			function successCallback( res ) {
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

    // add new trips in tripForm
    function updateTransactions(transactionType){
      if(transactionType === 'receivedAmount'){
				vm.trip.transactions.push({
					amount:vm.amount,
					credit: true,
					category:'',
					sub_category: '',
					remarks:'',
					image:''
				});
			};
		}

    // delete last trips in tripForm
    function rmTrip(){
      vm.trip.trips.pop();
    }

	}
}() );
