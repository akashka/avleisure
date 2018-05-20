(function () {
  'use strict';

  angular
    .module('enquiries')
    .controller('QuotationsController', QuotationsController);

  QuotationsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'Notification', 'EnquiriesService', 'ItineriesService', '$timeout'];

  function QuotationsController($scope, $state, $window, Authentication, Notification, EnquiriesService, ItineriesService, $timeout) {
    var vm = this;

    vm.enquiries = EnquiriesService.query();
    vm.authentication = Authentication;
    vm.itineries = ItineriesService.query();
    vm.enquiry = null;
    vm.save = save;
    vm.isSearched = false;
    vm.itineryDescription = '';

    vm.search = {
      enquiry_id: "",
      school_name: ""
    }

    $scope.tab = 1;

    $scope.setTab = function(newTab){
      $scope.tab = newTab;
    };

    $scope.isSet = function(tabNum){
      return $scope.tab === tabNum;
    };

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
                  transport: [],
                  accomodation: [],
                  food: [],
                  sharing: [],
                  package_type: [],
                  entry: 0,
                  extras: []
              });
              
              for(var c=0; c<vm.enquiry.enquiries[v].accomodation.length; c++) {
                vm.enquiry.enquiries[v].quotations[0].accomodation.push(0);
              }
              for(var c=0; c<vm.enquiry.enquiries[v].food.length; c++) {
                vm.enquiry.enquiries[v].quotations[0].food.push(0);
              }
              for(var c=0; c<vm.enquiry.enquiries[v].transport.length; c++) {
                vm.enquiry.enquiries[v].quotations[0].transport.push(0);
              }
              for(var c=0; c<vm.enquiry.enquiries[v].sharing.length; c++) {
                vm.enquiry.enquiries[v].quotations[0].sharing.push(0);
              }
              for(var c=0; c<vm.enquiry.enquiries[v].package_type.length; c++) {
                vm.enquiry.enquiries[v].quotations[0].package_type.push(0);
              }
              for(var c=0; c<vm.enquiry.enquiries[v].extras.length; c++) {
                vm.enquiry.enquiries[v].quotations[0].extras.push(0);
              }
            }
            for(var v = 0; v < vm.itineries.length; v++) {
              if(vm.itineries[v]._id === vm.enquiry.enquiries[0].itineries) {
                vm.itineryDescription = vm.itineries[v];
              }
            }
            vm.isSearched = true;
        }
    }

    vm.onValChange = function(val, changedto, $index) {
        changedto[$index] = val;
    }

    vm.showItineryDetail = function(itineries) {
        for(var v = 0; v < vm.itineries.length; v++) {
          if(vm.itineries[v]._id === itineries) {
            vm.itineryDescription = vm.itineries[v];
          }
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
      // sum += (Number(quot.itinery) + Number(quot.plan) + Number(quot.entry));
      for(var k=0; k<quot.transport.length; k++) {
        sum += Number(quot.transport[k]);
      }
      for(var k=0; k<quot.accomodation.length; k++) {
        sum += Number(quot.accomodation[k]);
      }
      for(var k=0; k<quot.food.length; k++) {
        sum += Number(quot.food[k]);
      }
      for(var k=0; k<quot.sharing.length; k++) {
        sum += Number(quot.sharing[k]);
      }
      for(var k=0; k<quot.package_type.length; k++) {
        sum += Number(quot.package_type[k]);
      }
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

    $timeout( function(){
      if($state.params.enquiryId != "")  {  
          vm.search.enquiry_id = $state.params.enquiryId;
          vm.searches();
      }
    }, 1000 );

    vm.findItinery = function(id) {
      for(var v = 0; v < vm.itineries.length; v++) {
        if(vm.itineries[v]._id === id) {
          console.log(vm.itineries[v]);
          return vm.itineries[v];
        }
      }
    }

  }
}());
