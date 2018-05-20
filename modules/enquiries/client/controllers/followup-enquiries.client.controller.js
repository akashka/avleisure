(function () {
  'use strict';

  angular
    .module('enquiries')
    .controller('EnquiriesFollowupController', EnquiriesFollowupController);

  EnquiriesFollowupController.$inject = ['$scope', 'EnquiriesService', 'Authentication', '$timeout', '$state', 'UsersService', 'ItineriesService'];

  function EnquiriesFollowupController($scope, EnquiriesService, Authentication, $timeout, $state, UsersService, ItineriesService) {
    var vm = this;

    vm.enquiry = EnquiriesService.query();
    vm.users = UsersService.query();
    vm.itineries = ItineriesService.query();
    vm.authentication = Authentication;

    $timeout( function(){
			if($state.params.enquiryId) {
				var allEnquiries = (vm.enquiry);
				for(var i=0; i<allEnquiries.length; i++) {
					if(allEnquiries[i]._id == $state.params.enquiryId) {
						vm.enquiry = allEnquiries[i];
					}
				}
			}
    }, 1000 );

    vm.multiselectSettings = { 
			checkBoxes: true, 
			displayProp: "displayName",
			idProp: "_id"
		};
    
    vm.selectDate = function ( $event, num ) {
			if ( num == 1 ) {
				vm.dateset.dated.isOpened = true;
			}
		};
		vm.dateOptions = {
			formatYear: 'yy',
			maxDate: new Date( 2030, 5, 22 ),
			minDate: new Date( 1920, 5, 22 ),
			startingDay: 1
		};

		vm.dateset = {
			dated: {
				isOpened: false
			},
    };

    vm.followup = {
      dated: new Date(),
      remarks: '',
      executive: []
    }
    
    vm.save = function(){
      vm.enquiry.followups.push(vm.followup);
			// Create a new enquiry, or update the current instance
			// if(vm.enquiry.enquiry_id == "") vm.enquiry.enquiry_id = ("ENQ" + vm.allEnquiries.length);
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
    
    vm.findItineryName = function(itinery) {
        for(var v=0; v<vm.itineries.length; v++) {
          if(vm.itineries[v]._id == itinery) return vm.itineries[v].title;
        }
        return '';
    }

    vm.findQuotedAmount = function(enquiry) {
      var amt = 0;
      return amt;
    }

  }
}());
