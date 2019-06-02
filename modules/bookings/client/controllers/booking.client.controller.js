( function () {
	'use strict';
	angular.module( 'bookings' ).controller( 'BookingsAdminController', BookingsAdminController );
	BookingsAdminController.$inject = [ '$scope', '$state', '$window', 'bookingResolve', 'Authentication', 'Notification', 'BookingsService', 'EnquiriesService', 'UsersService', '$timeout', 'TripsService', 'ItineriesService' ];

	function BookingsAdminController( $scope, $state, $window, booking, Authentication, Notification, BookingsService, EnquiriesService, UsersService, $timeout, TripsService, ItineriesService ) {
		var vm = this;
		vm.users = UsersService.query();
		EnquiriesService.query().$promise.then(function (response) {
			vm.enquiries = response;
			vm.searches();
		});

		vm.bookings = BookingsService.query();
		vm.trips = TripsService.query();
		vm.itineries = ItineriesService.query();
		vm.booking = booking;
		vm.authentication = Authentication;
		vm.form = {};
		vm.remove = remove;
		vm.save = save;
		vm.isSearched = false;
		vm.search = {
			enquiry_id: "",
			school_name: ""
		}
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
	
		vm.searches = function () {
			vm.enquiry = null;
			var searched = [];
			for ( var e = 0; e < vm.enquiries.length; e++ ) {
				if ( vm.search.enquiry_id != null && vm.search.enquiry_id != undefined && vm.search.enquiry_id != "" && ( vm.search.school_name == null || vm.search.school_name == undefined || vm.search.school_name == "" ) && vm.search.enquiry_id == vm.enquiries[ e ].enquiry_id ) {
					searched.push( vm.enquiries[ e ] );
				} else if ( ( vm.search.enquiry_id == null || vm.search.enquiry_id == undefined || vm.search.enquiry_id == "" ) && vm.search.school_name != null && vm.search.school_name != undefined && vm.search.school_name != "" && vm.search.school_name.toLowerCase() == vm.enquiries[ e ].school_name.toLowerCase() ) {
					searched.push( vm.enquiries[ e ] );
				} else if ( vm.search.enquiry_id != null && vm.search.enquiry_id != undefined && vm.search.enquiry_id != "" && vm.search.school_name != null && vm.search.school_name != undefined && vm.search.school_name != "" && vm.search.school_name.toLowerCase() == vm.enquiries[ e ].school_name.toLowerCase() && vm.search.enquiry_id == vm.enquiries[ e ].enquiry_id ) {
					searched.push( vm.enquiries[ e ] );
				}
			}
			if ( searched.length > 0 ) {
				vm.enquiry = searched[ 0 ];
				vm.booking.enquiry_id = vm.enquiry.enquiry_id;
				vm.booking.booking_id = 'BKNG'+ vm.bookings.length;
				vm.booking.school_name = vm.enquiry.school_name;
				vm.booking.contact_person = vm.enquiry.school_contact_person;
				vm.booking.contact_email = vm.enquiry.school_email_id;
				vm.booking.contact_phone = vm.enquiry.school_phone_no;
				vm.booking.no_of_staff = vm.enquiry.enquiries[0].no_of_teachers;
				vm.booking.no_of_students = vm.enquiry.enquiries[0].no_of_students;
				vm.booking.class = vm.enquiry.enquiries[0].school_class;
				vm.booking.destination = vm.enquiry.enquiries[0].itineries;
				vm.booking.booking_time = moment().hour(12).minute(0);
				vm.isSearched = true;
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
				var trip = {
					trip_id: "TRIP" + vm.trips.length,
					booking_id: vm.booking.booking_id,
					// executive_id: vm.booking.tour_managers,
					trip_start_date: vm.booking.booking_date,
					trip_start_by: vm.authentication.user.email,
					transactions: [],
					details: [],
					trip_started: false
				}
				TripsService.createOrUpdate(trip).then( successCallback ).catch( errorCallback );
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
			if(vm.booking.booking_amount == undefined && tocal == 'balance') return 0;
			for(var i=0; i<vm.booking.amount_paid.length; i++) {
				paid += Number(vm.booking.amount_paid[i].amount_paid);
			}
			if(tocal == 'paid') return paid;
			if(tocal == 'balance') return (Number(vm.booking.booking_amount)-paid);
		}

		vm.addExtraPay = function() {
			if(vm.booking.amount_paid == undefined) vm.booking.amount_paid = [];
			vm.booking.amount_paid.push({
				amount_paid: 0,
				payment_date: moment(),
				payment_mode: [],
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
			if($state.params.enquiryId != "")  {  
				vm.search.enquiry_id = $state.params.enquiryId;
				vm.searches();
			}
		}, 1000 );

		vm.calBookingAmount = function(booking_amount) {
			var amt = 0;
			if(vm.booking.no_of_staff != undefined) amt += Number(booking_amount) * Number(vm.booking.no_of_staff);
			if(vm.booking.no_of_students != undefined) amt += Number(booking_amount) * Number(vm.booking.no_of_students);
			vm.booking.total_booking_amount = amt;
		}

	}
}() );
