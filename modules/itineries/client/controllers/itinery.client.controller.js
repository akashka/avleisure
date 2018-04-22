(function () {
  'use strict';

  angular
    .module('itineries')
    .controller('ItineriesAdminController', ItineriesAdminController);

  ItineriesAdminController.$inject = ['$scope', '$state', '$window', 'itineryResolve', 'Authentication', 'Notification', 'ItineriesService', '$http'];

  function ItineriesAdminController($scope, $state, $window, itinery, Authentication, Notification, ItineriesService, $http) {
    var vm = this;
    vm.itinery = itinery;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    var req = {
      method: 'GET',
      url: 'https://restcountries-v1.p.mashape.com/all',
      headers: {
        'X-Mashape-Key': "4wOIcPPcz5mshzxfbe0rJDkWEJPip1Mz7FFjsnuwnKvsUAdcVg"
      }
    }

    $http(req).then(function(result){
        vm.countries = result.data; 
    }, function(error){
          console.log(error);
    });

    vm.itinery.sstate = [];
    vm.multiselectOptions = [{ id: 'Andaman and Nicobar Islands', label: 'Andaman and Nicobar Islands'}, { id: 'Andhra Pradesh', label: 'Andhra Pradesh'},
{ id: 'Arunachal Pradesh', label: 'Arunachal Pradesh'}, { id: 'Assam', label: 'Assam'}, { id: 'Bihar', label: 'Bihar'},
{ id: 'Chandigarh', label: 'Chandigarh'}, { id: 'Chhattisgarh', label: 'Chhattisgarh'}, { id: 'Dadra and Nagar Haveli', label: 'Dadra and Nagar Haveli'},
{ id: 'Daman and Diu union', label: 'Daman and Diu union'}, { id: 'Delhi', label: 'Delhi'}, { id: 'Goa', label: 'Goa'},
{ id: 'Gujarat', label: 'Gujarat'}, { id: 'Haryana', label: 'Haryana'}, { id: 'Himachal Pradesh', label: 'Himachal Pradesh'},
{ id: 'Jammu and Kashmir', label: 'Jammu and Kashmir'}, { id: 'Jharkhand', label: 'Jharkhand'}, { id: 'Karnataka', label: 'Karnataka'},
{ id: 'Kerala', label: 'Kerala'}, { id: 'Lakshadweep', label: 'Lakshadweep'}, { id: 'Madhya Pradesh', label: 'Madhya Pradesh'},
{ id: 'Maharashtra', label: 'Maharashtra'}, { id: 'Manipur', label: 'Manipur'}, { id: 'Meghalaya', label: 'Meghalaya'},
{ id: 'Mizoram', label: 'Mizoram'}, { id: 'Nagaland', label: 'Nagaland'}, { id: 'Odisha', label: 'Odisha'},
{ id: 'Puducherry', label: 'Puducherry'}, { id: 'Punjab', label: 'Punjab'}, { id: 'Rajasthan', label: 'Rajasthan'},
{ id: 'Sikkim', label: 'Sikkim'}, { id: 'Tamil Nadu', label: 'Tamil Nadu'}, { id: 'Telangana', label: 'Telangana'},
{ id: 'Tripura', label: 'Tripura'}, { id: 'Uttar Pradesh', label: 'Uttar Pradesh'},
{ id: 'Uttarakhand', label: 'Uttarakhand'}, { id: 'West Bengal', label: 'West Bengal'}];
    vm.multiselectSettings = { checkBoxes: true, };

    vm.onCountryChange = function() {
        // var alphacode = "";
        // for(var i=0; i<vm.countries.length; i++) {
        //   if(vm.countries[i].name == vm.user.international) alphacode = vm.countries[i].alpha3Code;
        // }
        // var req = {
        //   method: 'GET',
        //   url: '/api/getCities/' + alphacode
        // }
        // $http(req).then(function(result){
        //     vm.multiselectOptions = result.RestResponse.result; 
        // }, function(error){
        //       console.log(error);
        // });
    }

    // Remove existing itinery
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.itinery.$remove(function () {
          $state.go('itineries.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Itinery deleted successfully!' });
        });
      }
    }

    // Save Itinery
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.itineryForm');
        return false;
      }

      // Create a new itinery, or update the current instance
      vm.itinery.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('itineries.list'); // should we send the User to the list or the updated itineries view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Itinery saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Itineries save error!' });
      }
    }
  }
}());
