( function () {
	'use strict';
	angular.module( 'trips' ).controller( 'TripsAdminController', TripsAdminController );
	TripsAdminController.$inject = [ '$scope', '$state', '$window', 'tripResolve', 'Authentication', 'Notification', 'TripsService', 'ItineriesService', '$timeout', 'UsersService', 'BookingsService', 'EnquiriesService' ];

	function TripsAdminController( $scope, $state, $window, trip, Authentication, Notification, TripsService, ItineriesService, $timeout, UsersService, BookingsService, EnquiriesService) {
		var vm = this;
		vm.trip = trip;
		vm.allTrips = TripsService.query();
		vm.itineries = ItineriesService.query();
		vm.authentication = Authentication;
		vm.users = UsersService.query();
		vm.bookings = BookingsService.query();
		vm.enquiries = EnquiriesService.query();
		vm.form = {};
		vm.remove = remove;
		vm.save = save;
		vm.rmTrip  = rmTrip;
		vm.updateTransactions = updateTransactions;
		vm.amount = '';
		vm.school_name = '';
		vm.trip.executive_id = [];

		$timeout( function(){
			if($state.params.tripId) {
				var allTrips = (vm.allTrips);
				for(var i=0; i<allTrips.length; i++) {
					if(allTrips[i]._id == $state.params.tripId) {
						vm.trip = allTrips[i];
					}
				}
			}
			vm.ongoingTrip = _.filter(vm.allTrips, function(trip) { 
				return (trip.trip_end_date != undefined && trip.trip_end_date != null && trip.trip_end_date != ""
        			&& trip.trip_end_by != undefined && trip.trip_end_by != null && trip.trip_end_by != ""); 
			});
			for(var v=0; v<vm.users.length; v++) {
				var isOn = _.filter(vm.ongoingTrip, function(o) {
					return o.executive_id == vm.users[v]._id
				});
				if(isOn.length > 0) {
					vm.users.splice(v,1);
					v--;
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

		vm.gotoNewTrip = function() {

		}
		
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
			if(vm.trip.trip_id == "" || vm.trip.trip_id == undefined) 
					vm.trip.trip_id = ("TRIP" + vm.allTrips.length);
			if(vm.trip.trip_start_by == "" || vm.trip.trip_start_by == undefined)
					vm.trip.trip_start_by = vm.authentication.user.email;
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
				if(vm.trip.transactions == undefined) vm.trip.transactions = [];
				vm.trip.transactions.push({
					amount:vm.amount,
					credit: true,
					category: 'Opening Balance',
					sub_category: '',
					remarks: vm.remarks,
					image:'',
					transaction_date: new Date()
				});
			};
		}

		// delete last trips in tripForm
		function rmTrip(){
			vm.trip.trips.pop();
		}

		vm.onSchoolNameChanged = function() {
			// vm.school_name
		}
		
		vm.multiselectSettings = { 
			checkBoxes: true, 
			displayProp: "displayName",
			idProp: "_id"
		};

		vm.school_names = [];
		vm.complete = function(selectedSchool) {
			vm.school_names = [];
			var output=[];
			angular.forEach(vm.bookings,function(clts){
				if(clts.school_name.toLowerCase().indexOf(selectedSchool.toLowerCase())>=0){
					output.push(clts);
				}
			});
			vm.school_names=output;
			vm.isBookingIdCorrect = true;
		}

		vm.fillTextbox=function(string){
			vm.school_name=string.school_name;
			vm.school_names=[];
			vm.trip.booking_id = _.find(vm.bookings, function(o) {
				return o.school_name == string.school_name;
			}).booking_id;
		}
		
		vm.isBookingIdCorrect = true;
		vm.OnBookingIdChange = function() {
			var cd = _.find(vm.bookings, function(o) {
				return o.booking_id == vm.trip.booking_id;
			});
			if(cd != undefined) {
				vm.school_name = cd.school_name;
				vm.isBookingIdCorrect = true;
			}
			else {
				vm.school_name = '';
				vm.isBookingIdCorrect = false;
			}
		}

	}
}() );
