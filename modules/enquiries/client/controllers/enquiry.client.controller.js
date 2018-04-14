( function () {
	'use strict';
	angular.module( 'enquiries' ).controller( 'EnquiriesAdminController', EnquiriesAdminController );
	EnquiriesAdminController.$inject = [ '$scope', '$state', '$window', 'enquiryResolve', 'Authentication', 'Notification', 'EnquiriesService' ];

	function EnquiriesAdminController( $scope, $state, $window, enquiry, Authentication, Notification, EnquiriesService ) {
		var vm = this;
		vm.enquiry = enquiry;
		vm.authentication = Authentication;
		vm.form = {};
		vm.remove = remove;
		vm.save = save;
    vm.rmEnquiry  = rmEnquiry;
    vm.add = add;
		// Remove existing enquiry
		function remove() {
			if ( $window.confirm( 'Are you sure you want to delete?' ) ) {
				vm.enquiry.$remove( function () {
					$state.go( 'enquiries.list' );
					Notification.success( {
						message: '<i class="glyphicon glyphicon-ok"></i> Enquiry deleted successfully!'
					} );
				} );
			}
		}
		// Save Enquiry
		function save( isValid ) {
			if ( !isValid ) {
				$scope.$broadcast( 'show-errors-check-validity', 'vm.form.enquiryForm' );
				return false;
			}
			// Create a new enquiry, or update the current instance
			vm.enquiry.createOrUpdate().then( successCallback ).catch( errorCallback );

			function successCallback( res ) {
				$state.go( 'enquiries.list' ); // should we send the User to the list or the updated enquiries view?
				Notification.success( {
					message: '<i class="glyphicon glyphicon-ok"></i> Enquiry saved successfully!'
				} );
			}

			function errorCallback( res ) {
				Notification.error( {
					message: res.data.message,
					title: '<i class="glyphicon glyphicon-remove"></i> Enquiries save error!'
				} );
			}
		}
    // add new enquiries in enquiryForm
    function add(){
      vm.enquiry.enquiries.push(
        {
  				itineries: '',
  				plan: '',
  				school_contact_person: '',
  				school_class: '',
  				transport: '',
  				food: '',
  				sharing: '',
  				accomodation: '',
  				quotations: []
  			}
      );
    }
    // delete last enquiries in enquiryForm
    function rmEnquiry(){
      vm.enquiry.enquiries.pop();
    }
    //update enquiry form
	}
}() );
