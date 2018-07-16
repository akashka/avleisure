( function () {
	'use strict';
	angular.module( 'bookings' ).controller( 'BookingsAddPaymentController', BookingsAddPaymentController );
	BookingsAddPaymentController.$inject = [ '$scope', '$state', '$window', 'bookingResolve', 'Authentication', 'Notification', 'BookingsService', 'EnquiriesService', 'UsersService', '$timeout' ];

	function BookingsAddPaymentController( $scope, $state, $window, booking, Authentication, Notification, BookingsService, EnquiriesService, UsersService, $timeout ) {
		var vm = this;
		vm.users = UsersService.query();
		vm.enquiries = EnquiriesService.query();
		vm.bookings = BookingsService.query();
		vm.authentication = Authentication;
		vm.form = {};
        vm.save = save;
        
        $timeout(function() {
			if($state.params.bookingId) {
				var allBookings = vm.bookings;
				for(var i=0; i<allBookings.length; i++) {
					if(allBookings[i]._id == $state.params.bookingId) {
						vm.booking = allBookings[i];
					}
				}
			}
        }, 1000);
        
        vm.payment = {
				amount_paid: 0,
				payment_date: new Date(),
				// isOpened: false,
				cheque_number: "",
				bank_name: "",
				cheque_photo: "",
				payment_mode: "",
				transaction_number: "",
				remarks: ""
		};

		vm.dateset = {
			lr_date: {
				isOpened: false
			}
		};

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
	
		// Save Booking
		$scope.message = "";
		function save( isValid ) {
			$scope.message = "";
			if ( !isValid ) {
				$scope.$broadcast( 'show-errors-check-validity', 'vm.form.bookingForm' );
				return false;
			}
			
			if(vm.payment.payment_date == '' || moment(vm.payment.payment_date).isBefore(moment().subtract(1, 'day'))) {
				$scope.message = "Enter Valid Date";
				return false;		
			}

			if(vm.payment.payment_mode == '') {
				$scope.message = "Enter Valid Mode";
				return false;		
			}
            
            vm.booking.amount_paid.push(vm.payment);
			// Create a new booking, or update the current instance
			vm.booking.createOrUpdate().then( successCallback ).catch( errorCallback );

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

	}
}() );
