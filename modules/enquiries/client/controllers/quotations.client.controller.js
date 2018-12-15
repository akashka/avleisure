(function () {
  'use strict';

  angular
    .module('enquiries')
    .controller('QuotationsController', QuotationsController);

  QuotationsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'Notification', 'EnquiriesService', 'ItineriesService', '$timeout'];

  function QuotationsController($scope, $state, $window, Authentication, Notification, EnquiriesService, ItineriesService, $timeout) {
    var vm = this;

    EnquiriesService.query().$promise.then(function(response){
        vm.enquiries = response;
        if($state.params.enquiryId != "")  {
            vm.search.enquiry_id = $state.params.enquiryId;
            vm.searches();
        }
    });
    vm.authentication = Authentication;
    vm.itineries = ItineriesService.query();
    vm.enquiry = null;
    vm.save = save;
    vm.isSearched = false;
    vm.itineryDescription = '';

    vm.show_transport = false;
    vm.show_accomodation = false;
    vm.show_food = false;
    vm.show_sharing = false;
    vm.show_entry = false;
    vm.show_extras = false;

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
              if(vm.enquiry.enquiries[v].quotations == undefined || vm.enquiry.enquiries[v].quotations == null) {
                vm.enquiry.enquiries[v].quotations = [];
              }
              vm.enquiry.enquiries[v].quotations.unshift({
                  createdon: new Date(),
                  itinery: 0,
                  plan: 0,
                  transport: [],
                  accomodation: [],
                  food: [],
                  sharing: [],
                  package_type: 0,
                  entry: [],
                  extras: [],
                  remarks: '',
                  transport_total: 0,
                  transport_remarks: '',
                  accomodation_total: 0,
                  accomodation_remarks: '',
                  food_total: 0,
                  food_remakrs: '',
                  entry_total: 0,
                  entry_remarks: '',
                  extra_total: 0,
                  extra_remarks: '',
                  total_total: 0
              });
              for(var c=0; c<vm.enquiry.enquiries[v].accomodation.length; c++) {
                vm.enquiry.enquiries[v].quotations[0].accomodation.push({
                  beds: 0,
                  charge: 0,
                  tax: 0,
                  others: 0,
                  amount: 0,
                  remarks: '',
                  per_amount: 0,
                  seating: Number(vm.enquiry.enquiries[v].no_of_students) + Number(vm.enquiry.enquiries[v].no_of_teachers)
                });
              }
              for(var c=0; c<vm.enquiry.enquiries[v].food.length; c++) {
                vm.enquiry.enquiries[v].quotations[0].food.push({
                  tax: 0,
                  others: 0,
                  amount: 0,
                  no_of_days: 0,
                  no_of_person: 0,
                  remarks: '',
                  per_amount: 0
                });
              }
              for(var c=0; c<vm.enquiry.enquiries[v].transport.length; c++) {
                vm.enquiry.enquiries[v].quotations[0].transport.push({
                    seating: 0,
                    toll: 0,
                    bata: 0,
                    parking: 0,
                    tax: 0,
                    others: 0,
                    amount: 0,
                    remarks: '',
                    per_amount: 0,
                    price_per_km: 0,
                    kms: 0
                });
              }
              for(var c=0; c<vm.enquiry.enquiries[v].sharing.length; c++) {
                vm.enquiry.enquiries[v].quotations[0].sharing.push({
                  tax: 0,
                  others: 0,
                  amount: 0
                });
              }
              if(vm.enquiry.enquiries[v].entry == undefined) vm.enquiry.enquiries[v].entry = [];
              for(var c=0; c<vm.enquiry.enquiries[v].entry.length; c++) {
                vm.enquiry.enquiries[v].quotations[0].entry.push({
                  amount: 0
                });
              }
              if(vm.enquiry.enquiries[v].extras == undefined) vm.enquiry.enquiries[v].extras = [];
              for(var c=0; c<vm.enquiry.enquiries[v].extras.length; c++) {
                vm.enquiry.enquiries[v].quotations[0].extras.push({
                  amount: 0
                });
              }
            }
            getDuplicates();
            vm.isSearched = true;
        }
    }

    vm.savedList = [];
    var getDuplicates = function() {
      vm.savedList = [];
      for(var e=0; e<vm.enquiry.enquiries.length; e++) {
          vm.savedList[e] = [];
          for(var l=0; l<vm.enquiries.length; l++) {
            if(vm.enquiries[l]._id != vm.enquiry._id) {
              for(var m=0; m<vm.enquiries[l].enquiries.length; m++) {
                  var xyz = vm.enquiries[l].enquiries[m];
                  if(xyz.accomodation == vm.enquiry.enquiries[e].accomodation &&
                      xyz.food == vm.enquiry.enquiries[e].food &&
                      xyz.itineries == vm.enquiry.enquiries[e].itineries &&
                      xyz.package_type == vm.enquiry.enquiries[e].package_type &&
                      xyz.plan == vm.enquiry.enquiries[e].plan &&
                      xyz.sharing == vm.enquiry.enquiries[e].sharing &&
                      xyz.transport == vm.enquiry.enquiries[e].transport) {
                            vm.savedList[e] = xyz.quotations;
                            console.log(vm.savedList[e]);
                      }
              }
            }
          }
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

    vm.addtoamtTrans = function(arr) {
      arr.amount = 0;
      arr.amount += Number(arr.toll);
      arr.amount += Number(arr.bata);
      arr.amount += Number(arr.tax);
      arr.amount += Number(arr.others);
      arr.amount += Number(arr.parking);
      arr.amount += (Number(arr.price_per_km)*Number(arr.kms));
      arr.per_amount = Number(arr.amount) / Number(arr.seating);
    }

    vm.addtoamtACC = function(arr) {
      arr.amount = 0;
      arr.amount += Number(arr.tax);
      arr.amount += Number(arr.others);
      arr.amount += (Number(arr.charge) * Number(arr.seating));
      arr.per_amount = Number(arr.amount) / Number(arr.seating);
    }

    vm.addtoamt = function(arr) {
      arr.amount = 0;
      arr.amount += Number(arr.tax);
      arr.amount += Number(arr.others);
    }

    vm.addtoamtFOOD = function(arr) {
        arr.amount = 0;
        arr.amount += Number(arr.tax);
        arr.amount += Number(arr.others);
        arr.amount += (Number(arr.no_of_days) * Number(arr.no_of_person));
        arr.per_amount = Number(arr.amount) / Number(arr.no_of_person);
    }

    vm.calculateEachTotal = function(arr) {
      var sum = 0;

      for(var a=0; a<arr.length; a++) {
        sum += Number(arr[a].amount);
      }
      return sum;
    }

    vm.findTotal = function(quot) {
      var sum = 0;
      // sum += (Number(quot.itinery) + Number(quot.plan) + Number(quot.entry));
      for(var k=0; k<quot.transport.length; k++) {
        sum += Number(quot.transport[k].amount);
      }
      for(var k=0; k<quot.accomodation.length; k++) {
        sum += Number(quot.accomodation[k].amount);
      }
      for(var k=0; k<quot.food.length; k++) {
        sum += Number(quot.food[k].amount);
      }
      for(var k=0; k<quot.sharing.length; k++) {
        sum += Number(quot.sharing[k].amount);
      }
      for(var k=0; k<quot.package_type.length; k++) {
        sum += Number(quot.package_type[k].amount);
      }
      for(var k=0; k<quot.entry.length; k++) {
        sum += Number(quot.entry[k].amount);
      }
      for(var k=0; k<quot.extras.length; k++) {
        sum += Number(quot.extras[k].amount);
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

    vm.findItinery = function(id) {
      for(var v = 0; v < vm.itineries.length; v++) {
        if(vm.itineries[v]._id === id) {
          return vm.itineries[v];
        }
      }
    }

    vm.addTransport = function(index) {
      vm.enquiry.enquiries[index].transport.push("Extra Transport");
      for(var v=0; v<vm.enquiry.enquiries[index].quotations.length;v++) {
        vm.enquiry.enquiries[index].quotations[v].transport.push({
                    seating: 0,
                    toll: 0,
                    bata: 0,
                    parking: 0,
                    tax: 0,
                    others: 0,
                    amount: 0,
                    remarks: '',
                    per_amount: 0,
                    price_per_km: 0,
                    kms: 0
        });
      }
    }

    vm.removeTransport = function(index) {
        vm.enquiry.enquiries[index].transport.splice(vm.enquiry.enquiries[index].transport.length-1, 1);
        for(var v=0; v<vm.enquiry.enquiries[index].quotations.length;v++) {
          vm.enquiry.enquiries[index].quotations[v].transport.splice(vm.enquiry.enquiries[index].quotations[v].transport.length-1, 1);
        }
    }

    vm.addAccomodation = function(index) {
      vm.enquiry.enquiries[index].accomodation.push("Extra Accomodation");
      for(var v=0; v<vm.enquiry.enquiries[index].quotations.length;v++) {
        vm.enquiry.enquiries[index].quotations[v].accomodation.push({
              beds: 0,
              charge: 0,
              tax: 0,
              others: 0,
              amount: 0,
              remarks: '',
              per_amount: 0,
              seating: Number(vm.enquiry.enquiries[v].no_of_students) + Number(vm.enquiry.enquiries[index].no_of_teachers)
        });
      }
    }

    vm.removeAccomodation = function(index) {
        vm.enquiry.enquiries[index].accomodation.splice(vm.enquiry.enquiries[index].length-1, 1);
        for(var v=0; v<vm.enquiry.enquiries[index].quotations.length;v++) {
          vm.enquiry.enquiries[index].quotations[v].accomodation.splice(vm.enquiry.enquiries[index].quotations[v].accomodation.length-1, 1);
        }
    }

    vm.addFood = function(index) {
        vm.enquiry.enquiries[index].food.push("Extra Food");
        for(var v=0; v<vm.enquiry.enquiries[index].quotations.length;v++) {
          vm.enquiry.enquiries[index].quotations[v].food.push({
            tax: 0,
            others: 0,
            amount: 0,
            no_of_days: 0,
            no_of_person: 0,
            remarks: '',
            per_amount: 0
          });
        }
    }

    vm.removeFood = function(index) {
        vm.enquiry.enquiries[index].food.splice(vm.enquiry.enquiries[index].length-1, 1);
        for(var v=0; v<vm.enquiry.enquiries[index].quotations.length;v++) {
          vm.enquiry.enquiries[index].quotations[v].food.splice(vm.enquiry.enquiries[index].quotations[v].food.length-1, 1);
        }
    }

    vm.addSharing = function(index) {
        vm.enquiry.enquiries[index].sharing.push("Extra Sharing");
        for(var v=0; v<vm.enquiry.enquiries[index].quotations.length;v++) {
          vm.enquiry.enquiries[index].quotations[v].sharing.push({
                tax: 0,
                others: 0,
                amount: 0
          });
        }
    }

    vm.removeSharing = function(index) {
        vm.enquiry.enquiries[index].sharing.splice(vm.enquiry.enquiries[index].length-1, 1);
        for(var v=0; v<vm.enquiry.enquiries[index].quotations.length;v++) {
          vm.enquiry.enquiries[index].quotations[v].sharing.splice(0, 1);
        }
    }

    vm.addEntry = function(index) {
          vm.enquiry.enquiries[index].entry.push("Extra Entry");
          for(var v=0; v<vm.enquiry.enquiries[index].quotations.length;v++) {
            vm.enquiry.enquiries[index].quotations[v].entry.push({
              amount: 0
            });
          }
    }

    vm.removeEntry = function(index) {
        vm.enquiry.enquiries[index].entry.splice(vm.enquiry.enquiries[index].length-1, 1);
        for(var v=0; v<vm.enquiry.enquiries[index].quotations.length;v++) {
          vm.enquiry.enquiries[index].quotations[v].entry.splice(vm.enquiry.enquiries[index].quotations[v].entry.length-1, 1);
        }
    }

    vm.addExtras = function(index) {
        vm.enquiry.enquiries[index].extras.push("extra"+vm.enquiry.enquiries[index].extras.length);
        for(var v=0; v<vm.enquiry.enquiries[index].quotations.length;v++) {
          vm.enquiry.enquiries[index].quotations[v].extras.push({
            amount: 0
          });
        }
    }

    vm.removeExtras = function(index) {
        vm.enquiry.enquiries[index].extras.splice(vm.enquiry.enquiries[index].length-1, 1);
        for(var v=0; v<vm.enquiry.enquiries[index].quotations.length;v++) {
          vm.enquiry.enquiries[index].quotations[v].extras.splice(vm.enquiry.enquiries[index].quotations[v].extras.length-1, 1);
        }
    }

    vm.onTransportTotalChange = function(quotations) {
        quotations.transport_total = 0;
        for(var t=0; t<quotations.transport.length; t++) {
            quotations.transport_total += Number(quotations.transport[t].per_amount);
        }
        vm.calculate_total_total(quotations);
    }

    vm.onAccTotalChange = function(quotations) {
        quotations.accomodation_total = 0;
        for(var t=0; t<quotations.accomodation.length; t++) {
            quotations.accomodation_total += Number(quotations.accomodation[t].per_amount);
        }
        vm.calculate_total_total(quotations);
    }

    vm.onFoodTotalChange = function(quotations) {
        quotations.food_total = 0;
        for(var t=0; t<quotations.food.length; t++) {
            quotations.food_total += Number(quotations.food[t].per_amount);
        }
        vm.calculate_total_total(quotations);
    }

    vm.onEntryTotalChange = function(quotations) {
        quotations.entry_total = 0;
        for(var v=0; v<quotations.entry.length; v++) {
          quotations.entry_total += Number(quotations.entry[v].amount);
        }
        vm.calculate_total_total(quotations);
    }

    vm.onExtraTotalChange = function(quotations) {
        quotations.extra_total = 0;
        for(var v=0; v<quotations.extra.length; v++) {
          quotations.extra_total += Number(quotations.extra[v].amount);
        }
        vm.calculate_total_total(quotations);
    }

    vm.calculate_total_total = function(quotations) {
        quotations.total_total = 0;
        quotations.total_total += Number(quotations.extra_total);
        quotations.total_total += Number(quotations.entry_total);
        quotations.total_total += Number(quotations.food_total);
        quotations.total_total += Number(quotations.accomodation_total);
        quotations.total_total += Number(quotations.transport_total);
    }

    vm.sendMail = function(quotation) {
      console.log("To Do - Send a mail to school");
    }

  }
}());
