(function () {
  'use strict';

  angular
    .module('enquiries')
    .controller('EnquiriesController', EnquiriesController);

  EnquiriesController.$inject = ['$scope', 'EnquiriesService', 'Authentication', '$timeout', '$state'];

  function EnquiriesController($scope, EnquiriesService, Authentication, $timeout, $state) {
    var vm = this;

    vm.enquiry = EnquiriesService.query();
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

  }
}());
