(function () {
  'use strict';

  angular
    .module('core')
    .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$scope', '$state', 'Authentication', 'menuService', 'BookingsService', 'EnquiriesService', '$timeout', 'TripsService'];

  function HeaderController($scope, $state, Authentication, menuService, BookingsService, EnquiriesService, $timeout, TripsService) {
    var vm = this;

    vm.accountMenu = menuService.getMenu('account').items[0];
    vm.authentication = Authentication;
    vm.isCollapsed = false;
    vm.menu = menuService.getMenu('topbar');
    vm.bookings = BookingsService.query();
    vm.trips = TripsService.query();
    vm.enquiry = EnquiriesService.query();

    $scope.$on('$stateChangeSuccess', stateChangeSuccess);

    function stateChangeSuccess() {
      // Collapsing the menu after navigation
      vm.isCollapsed = false;
      vm.bookings = BookingsService.query();
      vm.trips = TripsService.query();
      vm.enquiry = EnquiriesService.query();
      $timeout(function() {
        getNotifications();
        if(vm.authentication.user.roles[0] != 'admin') filterData();
      }, 1000);
    }

    var filterData = function() {
        vm.notifications.cheques = [];
        for(var e=0; e<vm.notifications.enquiries.length; e++) {
          if(vm.notifications.enquiries[e].user.email != vm.authentication.user.email) {
              vm.notifications.enquiries.splice(e,1);
              e--;
          }
        }
        for(var b=0; b<vm.notifications.bookings.length; b++) {
          if(vm.notifications.bookings[b].user.email != vm.authentication.user.email) {
              vm.notifications.bookings.splice(b,1);
              b--;
          }
        }
        for(var t=0; t<vm.notifications.trips.length; t++) {
          if(vm.notifications.trips[t].user.email != vm.authentication.user.email) {
              vm.notifications.bookings.splice(t,1);
              t--;
          }
        }
    }

    vm.notifications = {
        enquiries: [],
        bookings: [],
        cheques: [],
        trips: []
    };

    vm.notificationsCount = function() {
        var total = 0;
        angular.forEach(vm.notifications, function(element) {
          total += element.length;
        });
        return total;
    }

    vm.findSchoolName = function(booking_id) {
      var str = {school_name: ''};
      str = _.find(vm.bookings, function(o) {
          return o.booking_id == booking_id;
      });
      return str.school_name;
    }

    var getNotifications = function() {
        vm.notifications = {
            enquiries: [],
            bookings: [],
            cheques: [],
            trips: []
        };

      // New Enquiries  
        for(var e=0; e<vm.enquiry.length; e++) {
          var isFound = 0;
          for(var q=0; q<vm.enquiry[e].enquiries.length; q++) {
            if(vm.enquiry[e].enquiries[q].quotations.length > 0) isFound = true;
          }
          if(!isFound) vm.notifications.enquiries.push(vm.enquiry[e]);
        }

      // Booking next 10 days & Cheque next day
        for(var b=0; b<vm.bookings.length; b++){
          if(moment(vm.bookings[b].booking_date).format('dd-MM-yyyy') <= moment().add(10, 'day').format('dd-MM-yyyy'))
            vm.notifications.bookings.push(vm.bookings[b]);
          var isThere = false;
          for(var k=0; k<vm.bookings[b].amount_paid.length; k++) {
              if(moment(vm.bookings[b].amount_paid[k].amount_paid).format('dd-MM-yyyy') == moment().add(1, 'day').format('dd-MM-yyyy'))
                vm.notifications.cheques.push(vm.bookings[b]);
          }
        }

      // Ongoing Trips
        for(var t=0; t<vm.trips.length; t++) {
          var trip = vm.trips[t];
          if(!(trip.trip_end_date != undefined && trip.trip_end_date != null && trip.trip_end_date != ""
            && trip.trip_end_by != undefined && trip.trip_end_by != null && trip.trip_end_by != "") && trip.trip_started == true)
                vm.notifications.trips.push(trip);
        }
    }

    $timeout(function() {
      getNotifications();
    }, 1000);

  }
}());
