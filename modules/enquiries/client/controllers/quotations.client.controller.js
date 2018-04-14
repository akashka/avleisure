(function () {
  'use strict';

  angular
    .module('enquiries')
    .controller('QuotationsController', QuotationsController);

  QuotationsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'Notification', 'EnquiriesService', 'ItineriesService'];

  function QuotationsController($scope, $state, $window, Authentication, Notification, EnquiriesService, ItineriesService) {
    var vm = this;

    vm.enquiries = EnquiriesService.query();
    vm.authentication = Authentication;
    vm.itineries = ItineriesService.query();
    vm.enquiry = null;
    vm.save = save;
    vm.isSearched = false;

    vm.search = {
      enquiry_id: "",
      school_name: ""
    }

    vm.searches = function() {
        vm.enquiry = null;
        var searched = [];
        for(var e=0; e<vm.enquiries.length;e++) {
          if(vm.search.enquiry_id != null && vm.search.enquiry_id != undefined && vm.search.enquiry_id != "" &&
              (vm.search.school_name == null || vm.search.school_name == undefined || vm.search.school_name == "") &&
              vm.search.enquiry_id == vm.enquiries[e].enquiry_id) {
                    searched.push(vm.enquiries[e]);
          }
          else if((vm.search.enquiry_id == null || vm.search.enquiry_id == undefined || vm.search.enquiry_id == "") &&
              vm.search.school_name != null && vm.search.school_name != undefined && vm.search.school_name != "" &&
              vm.search.school_name.toLowerCase() == vm.enquiries[e].school_name.toLowerCase()) {
                    searched.push(vm.enquiries[e]);
          }
          else if(vm.search.enquiry_id != null && vm.search.enquiry_id != undefined && vm.search.enquiry_id != "" &&
              vm.search.school_name != null && vm.search.school_name != undefined && vm.search.school_name != "" &&
              vm.search.school_name.toLowerCase() == vm.enquiries[e].school_name.toLowerCase() &&
              vm.search.enquiry_id == vm.enquiries[e].enquiry_id) {
                    searched.push(vm.enquiries[e]);
          }
        }
        if(searched.length > 0) {
            vm.enquiry = searched[0];
            for(var v=0; v<vm.enquiry.enquiries.length; v++) {
              vm.enquiry.enquiries[v].quotations.unshift({
                  createdon: new Date(),
                  itinery: 0,
                  plan: 0,
                  transport: 0,
                  accomodation: 0,
                  food: 0,
                  entry: 0,
                  extras: []
              });
              // for(var i=0; i<vm.enquiry.enquiries[v].extras.length; i++) {
              //     vm.enquiry.enquiries[v].quotations.extras.push(0);
              // }
            }
            vm.isSearched = true;
        }
    }

    vm.findItineryName = function(id) {
      for(var v = 0; v < vm.itineries.length; v++) {
        if(vm.itineries[v]._id === id) {
          return vm.itineries[v].title;
        }
      }
      return "";
    }

    vm.addExtra = function(index) {
        vm.enquiry.enquiries[index].extras.push("extra"+vm.enquiry.enquiries[index].extras.length);
        for(var v=0; v<vm.enquiry.enquiries[index].quotations.length;v++) {
          vm.enquiry.enquiries[index].quotations[v].extras.push(0);
        }
    }

    vm.removeExtra = function(index) {
        vm.enquiry.enquiries[index].extras.splice(vm.enquiry.enquiries[index].length-1, 1);
        for(var v=0; v<vm.enquiry.enquiries[index].quotations.length;v++) {
          vm.enquiry.enquiries[index].quotations[v].extras.splice(vm.enquiry.enquiries[index].quotations[v].extras.length-1, 1);
        }
    }

    vm.findTotal = function(quot) {
      var sum = 0;
      sum += (Number(quot.itinery) + Number(quot.plan) + Number(quot.transport) + Number(quot.accomodation)
                + Number(quot.food) + Number(quot.entry));
      for(var k=0; k<quot.extras.length; k++) {
        sum += Number(quot.extras[k]);
      }
      return sum;
    }

    function save() {
      
			// Create a new enquiry, or update the current instance
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
    
  }
}());
