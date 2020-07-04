( function () {
	'use strict';
	angular.module( 'bookings' ).controller( 'BookingsEditController', BookingsEditController );
	BookingsEditController.$inject = [ '$scope', '$state', '$window', 'bookingResolve', 'Authentication', 'Notification', 'BookingsService', 'EnquiriesService', 'UsersService', '$timeout', 'TripsService', 'ItineriesService' ];

	function BookingsEditController( $scope, $state, $window, booking, Authentication, Notification, BookingsService, EnquiriesService, UsersService, $timeout, TripsService, ItineriesService ) {
		var vm = this;
		vm.users = UsersService.query();
		vm.enquiries = EnquiriesService.query();
		vm.bookings = BookingsService.query();
		vm.trips = TripsService.query();
		vm.itineries = ItineriesService.query();
		vm.booking = booking;
		vm.authentication = Authentication;
		vm.form = {};
		vm.remove = remove;
		vm.save = save;

		vm.multiselectSettings = {displayProp: 'displayName', idProp: '_id', externalIdProp: '_id',  smartButtonMaxItems: 3, checkBoxes: true};
		vm.booking.tour_managers = [];

		vm.selectDate = function ( $event, num ) {
			if ( num == 1 ) {
				vm.dateset.lr_date.isOpened = true;
			}
		};

		vm.selectDates = function ( $event, num ) {
			num.isOpened = true;
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

		vm.convert = function (amount){
			if(vm.booking.amount_paid === amount){
				vm.amount_paid = parseInt(vm.booking.amount_paid);
			}else if(vm.booking.booking_amount === amount){
				vm.booking_amount = parseInt(vm.booking.booking_amount);
			}
		}

		// Remove existing booking
		function remove() {
			if ( $window.confirm( 'Are you sure you want to delete?' ) ) {
				vm.booking.$remove( function () {
					$state.go( 'bookings.list' );
					Notification.success( {
						message: '<i class="glyphicon glyphicon-ok"></i> Booking deleted successfully!'
					} );
				} );
			}
		}

		// Save Booking
		$scope.message = '';
		function save( isValid ) {
			$scope.message = '';
			if ( !isValid ) {
				$scope.$broadcast( 'show-errors-check-validity', 'vm.form.bookingForm' );
				return false;
			}

			if(vm.booking.booking_date == undefined || vm.booking.booking_date == '' ||
					vm.booking.booking_time == '' || vm.booking.booking_time == null ||
					moment(vm.booking.booking_date).isBefore(moment())) {
				$scope.message = "Please select valid Execution Date and Time!"
				return false;
			}

			vm.booking.booking_date = moment(vm.booking.booking_date).set({
												'hour' : moment(vm.booking.booking_time).get('hour'),
												'minute': moment(vm.booking.booking_time).get('minute'),
												'second': 0
										});

			// Create a new booking, or update the current instance
			vm.booking.createOrUpdate().then( saveTrip ).catch( errorCallback );

			function saveTrip(res) {
				for(var v=0; v<vm.trips.length; v++) {
					if(vm.trips[v].booking_id == vm.booking.booking_id) {
						var trip = vm.trips[v];
						trip.executive_id = vm.booking.tour_managers;
						trip.trip_start_date = vm.booking.booking_date;
						// trip.trip_start_by = vm.authentication.user.email;
						TripsService.createOrUpdate(trip).then( successCallback ).catch( errorCallback );
					}
				}
			}

			function successCallback( res ) {
				$state.go( 'bookings.list' ); // should we send the User to the list or the updated bookings view?
				Notification.success( {
					message: '<i class="glyphicon glyphicon-ok"></i> Booking saved successfully!'
				} );
			}

			function errorCallback( res ) {
				Notification.error( {
					message: res.data.message,
					title: '<i class="glyphicon glyphicon-remove"></i> Bookings save error!'
				} );
			}
		}

		vm.calculateSchoolPayment = function(tocal){
			var paid = 0
			if(vm.booking.amount_paid == undefined && tocal == 'paid') return 0;
			if(vm.booking.total_booking_amount == undefined && tocal == 'balance') return 0;
			for(var i=0; i<vm.booking.amount_paid.length; i++) {
				paid += Number(vm.booking.amount_paid[i].amount_paid);
			}
			if(tocal == 'paid') return paid;
			if(tocal == 'balance') return (Number(vm.booking.total_booking_amount)-paid);
		}

		vm.addExtraPay = function() {
			if(vm.booking.amount_paid == undefined) vm.booking.amount_paid = [];
			vm.booking.amount_paid.push({
				amount_paid: 0,
				payment_date: moment(),
				isOpened: false,
				cheque_number: "",
				bank_name: "",
				cheque_photo: "",
				transaction_number: ""
			});
		}

		vm.removeExtraPay = function() {
			vm.booking.amount_paid.splice(vm.booking.amount_paid.length-1, 1);
		}

		$timeout( function(){
			if($state.params.bookingId != "")  {
				for(var i = 0; i < vm.bookings.length; i++) {
					if(vm.bookings[i]._id == $state.params.bookingId) {
						vm.booking.created = vm.bookings[i].created;
						vm.booking.enquiry_id = vm.bookings[i].enquiry_id;
						vm.booking.booking_id = vm.bookings[i].booking_id;
						vm.booking.booking_date = moment(vm.bookings[i].booking_date).toDate();
						vm.booking.booking_amount = vm.bookings[i].booking_amount;
						vm.booking.total_booking_amount = vm.bookings[i].total_booking_amount;
						vm.booking.school_name = vm.bookings[i].school_name;
						vm.booking.contact_person = vm.bookings[i].contact_person;
						vm.booking.contact_destination = vm.bookings[i].contact_destination;
						vm.booking.contact_phone = vm.bookings[i].contact_phone;
						vm.booking.contact_email = vm.bookings[i].contact_email;
						vm.booking.amount_paid = vm.bookings[i].amount_paid;
						for(var k = 0; k < vm.booking.amount_paid.length; k++) {
							vm.booking.amount_paid[k].payment_date = moment(vm.booking.amount_paid[k].payment_date).toDate();
						}
						vm.booking.no_of_students = vm.bookings[i].no_of_students;
						vm.booking.no_of_staff = vm.bookings[i].no_of_staff;
						vm.booking.class = vm.bookings[i].class;

						vm.booking.tour_managers = [];
						for(var u=0; u<vm.users.length; u++) {
							for(var t=0; t<vm.bookings[i].tour_managers.length; t++) {
								if(vm.bookings[i].tour_managers[t]._id == vm.users[u]._id)
									vm.booking.tour_managers.push(vm.users[u]);
							}
						}

						vm.booking.destination = vm.bookings[i].destination;
						vm.booking.billing = vm.bookings[i].billing[0];
						vm.booking.expenses = vm.bookings[i].expenses;
						vm.booking.user = vm.bookings[i].user;
						vm.booking._id = vm.bookings[i]._id;
						vm.booking.booking_time = vm.bookings[i].booking_date;
					}
				}
			}
		}, 1000 );

		vm.calBookingAmount = function(booking_amount) {
			var amt = 0;
			// if(vm.booking.no_of_staff != undefined) amt += Number(booking_amount) * Number(vm.booking.no_of_staff);
			if(vm.booking.no_of_students != undefined) amt += Number(booking_amount) * Number(vm.booking.no_of_students);
			vm.booking.total_booking_amount = amt;
		}

	}
}() );
