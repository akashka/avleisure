(function () {
  'use strict';

  angular
    .module('bookings')
    .controller('BookingsAdminController', BookingsAdminController);

  BookingsAdminController.$inject = ['$scope', '$state', '$window', 'bookingResolve', 'Authentication', 'Notification', 'BookingsService'];

  function BookingsAdminController($scope, $state, $window, booking, Authentication, Notification, BookingsService) {
    var vm = this;

    vm.booking = booking;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing booking
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.booking.$remove(function () {
          $state.go('bookings.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Booking deleted successfully!' });
        });
      }
    }

    // Save Booking
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.bookingForm');
        return false;
      }

      // Create a new booking, or update the current instance
      vm.booking.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('bookings.list'); // should we send the User to the list or the updated bookings view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Booking saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Bookings save error!' });
      }
    }
  }
}());
