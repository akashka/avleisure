(function () {
  'use strict';

  angular
    .module('users.admin')
    .controller('UserController', UserController);

  UserController.$inject = ['$scope', '$state', '$window', 'Authentication', 'userResolve', 'Notification', 'EnquiriesService', 'BookingsService'];

  function UserController($scope, $state, $window, Authentication, user, Notification, EnquiriesService, BookingsService) {
    var vm = this;
    vm.enquiries = EnquiriesService.query();
    vm.bookings = BookingsService.query();

    vm.authentication = Authentication;
    vm.user = user;
    vm.remove = remove;
    vm.update = update;
    vm.isContextUserSelf = isContextUserSelf;

    function remove(user) {
      if ($window.confirm('Are you sure you want to delete this user?')) {
        if (user) {
          user.$remove();

          vm.users.splice(vm.users.indexOf(user), 1);
          Notification.success('User deleted successfully!');
        } else {
          vm.user.$remove(function () {
            $state.go('admin.users');
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> User deleted successfully!' });
          });
        }
      }
    }

    function update(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }

      var user = vm.user;

      user.$update(function () {
        $state.go('admin.user', {
          userId: user._id
        });
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> User saved successfully!' });
      }, function (errorResponse) {
        Notification.error({ message: errorResponse.data.message, title: '<i class="glyphicon glyphicon-remove"></i> User update error!' });
      });
    }

    function isContextUserSelf() {
      return vm.user.username === vm.authentication.user.username;
    }

    vm.findNoOfEnquiries = function(user) {
      var books = _.map(vm.enquiries, function(o) {
          if (o.user._id == user._id) return o;
      });
      return books.length;
    }

    vm.findNoOfBookingsGot = function(user) {
      var books = _.map(vm.enquiries, function(o) {
          if (o.user._id == user._id) return o;
      });
      for(var i=0; i<books.length; i++) {
        var found = _.map(vm.bookings, function(o) {
          if (o.enquiry_id == books[i].enquiry_id) return o;
        });
        if(found.length <= 0) {
          books.splice(i,1);
          i--;
        }
      }
      return books.length;
    }

    vm.totalCashReceived = function(user) {

    }

    vm.advancesReceived = function(user) {

    }

    vm.calculateBata = function(user) {

    }

    vm.calculateProfitLoss = function(user) {

    }

    vm.getRemarks = function(user) {

    }

  }
}());
