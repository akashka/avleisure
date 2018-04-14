( function () {
	'use strict';
	angular.module( 'enquiries' ).controller( 'EnquiriesAdminController', EnquiriesAdminController );
	EnquiriesAdminController.$inject = [ '$scope', '$state', '$window', 'enquiryResolve', 'Authentication', 'Notification', 'EnquiriesService', 'ItineriesService', '$timeout' ];

	function EnquiriesAdminController( $scope, $state, $window, enquiry, Authentication, Notification, EnquiriesService, ItineriesService, $timeout ) {
		var vm = this;
		vm.enquiry = {
		  enquiry_id: "",
		  school_name: "",
		  school_address: "",
		  school_gprs: "",
		  school_photo: "",
		  school_email_id: "",
		  school_phone_no: "",
		  enquiries: [{
				itineries: '',
  				plan: '',
  				school_contact_person: '',
  				school_class: '',
  				transport: '',
  				food: '',
  				sharing: '',
  				accomodation: '',
					quotations: [],
					extras: []
			}]
		};
		vm.allEnquiries = EnquiriesService.query();
		vm.itineries = ItineriesService.query();
		vm.authentication = Authentication;
		vm.form = {};
		vm.remove = remove;
		vm.save = save;
		vm.rmEnquiry  = rmEnquiry;
		vm.add = add;

		$timeout( function(){
			if($state.params.enquiryId) {
				var allEnquiries = (vm.allEnquiries);
				for(var i=0; i<allEnquiries.length; i++) {
					if(allEnquiries[i]._id == $state.params.enquiryId) {
						vm.enquiry = allEnquiries[i];
					}
				}
			}
		}, 1000 );
		
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
		function save() {
			// Create a new enquiry, or update the current instance
			if(vm.enquiry.enquiry_id == "") vm.enquiry.enquiry_id = ("ENQ" + vm.allEnquiries.length);
			EnquiriesService.createOrUpdate(vm.enquiry).then( successCallback ).catch( errorCallback );

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
  				quotations: [],
					extras: []
		}
      );
		}
		
    // delete last enquiries in enquiryForm
    function rmEnquiry(){
      vm.enquiry.enquiries.pop();
    }

	}
}() );
