(function () {
  'use strict';

  angular
    .module('itineries')
    .controller('ItineriesAdminController', ItineriesAdminController);

  ItineriesAdminController.$inject = ['$scope', '$state', '$window', 'itineryResolve', 'Authentication', 'Notification', 'ItineriesService'];

  function ItineriesAdminController($scope, $state, $window, itinery, Authentication, Notification, ItineriesService) {
    var vm = this;

    vm.itinery = itinery;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

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
