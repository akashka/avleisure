(function () {
  'use strict';

  angular
    .module('enquiries')
    .controller('EnquiriesController', EnquiriesController);

  EnquiriesController.$inject = ['$scope', 'EnquiriesService', 'Authentication', '$timeout', '$state', 'ItineriesService'];

  function EnquiriesController($scope, EnquiriesService, Authentication, $timeout, $state, ItineriesService) {
    var vm = this;

    vm.enquiry = EnquiriesService.query();
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

    vm.findItineryName = function(itinery) {
        for(var v=0; v<vm.itineries.length; v++) {
          if(vm.itineries[v]._id == itinery) return vm.itineries[v].title;
        }
        return '';
    }

    vm.openMap = function(latlong) {
      var url = 'http://maps.google.com/maps?q=loc:' + latlong;
      window.open(url, '_blank');
    }

  }
}());
