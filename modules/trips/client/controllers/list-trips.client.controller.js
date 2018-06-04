(function () {
  'use strict';

  angular
    .module('trips')
    .controller('TripsListController', TripsListController);

  TripsListController.$inject = ['TripsService', '$state', 'UsersService', 'BookingsService', '$timeout', '$scope', 'Authentication'];

  function TripsListController(TripsService, $state, UsersService, BookingsService, $timeout, $scope, Authentication) {
    var vm = this;

    vm.trips = TripsService.query();
    vm.allTrips = TripsService.query();
    vm.users = UsersService.query();
    vm.bookings = BookingsService.query();
    vm.authentication = Authentication;
    vm.isUserAdmin = vm.authentication.user.roles.includes('admin');

    vm.search = {
      trip_id: "",
      booking_id: ""
    }

    vm.findExecutiveName = function(executive_id) {
        for(var i=0; i<vm.users.length; i++) {
          if(vm.users[i]._id == executive_id) return vm.users[i].displayName;
        }
    }

    vm.findTripStatus = function(trip) {
        if(trip.trip_end_date != undefined && trip.trip_end_date != null && trip.trip_end_date != ""
        && trip.trip_end_by != undefined && trip.trip_end_by != null && trip.trip_end_by != "")
          return "Completed";
        if(trip.trip_started) return "Ongoing";
        return "Upcoming";
    }

    vm.calculateBalance = function(transactions) {
        var sum = 0;
        for(var i=0; i<transactions.length; i++) {
          if(transactions[i].credit) sum += Number(transactions[i].amount);
          else sum -= Number(transactions[i].amount);
        }
        return sum;
    }

    vm.searches = function() {
        vm.trips = vm.allTrips;
        var searched = [];
        for(var e=0; e<vm.trips.length;e++) {
          if(vm.search.trip_id != null && vm.search.trip_id != undefined && vm.search.trip_id != "" &&
              (vm.search.booking_id == null || vm.search.booking_id == undefined || vm.search.booking_id == "") &&
              vm.search.trip_id == vm.trips[e].trip_id) {
                    searched.push(vm.trips[e]);
          }
          else if((vm.search.trip_id == null || vm.search.trip_id == undefined || vm.search.trip_id == "") && 
              vm.search.booking_id != null && vm.search.booking_id != undefined && vm.search.booking_id != "" &&
              vm.search.booking_id == vm.trips[e].booking_id) {
                    searched.push(vm.trips[e]);
          }
          else if(vm.search.trip_id != null && vm.search.trip_id != undefined && vm.search.trip_id != "" &&
              vm.search.booking_id != null && vm.search.booking_id != undefined && vm.search.booking_id != "" &&
              vm.search.booking_id == vm.trips[e].booking_id && vm.search.trip_id == vm.trips[e].trip_id) {
                    searched.push(vm.trips[e]);
          }
        }
        vm.trips = searched;
    }

    vm.reset = function() {
      vm.trips = vm.allTrips;
      vm.search = {
        trip_id: "",
        booking_id: ""
      };
    }

    vm.gotoNewTrip = function() {
        $state.go('trips.create');
    }
    
    vm.buildPager = function() {
      vm.pagedItems = [];
      vm.itemsPerPage = 15;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }
    
    vm.figureOutItemsToDisplay = function() {
      vm.filteredItems = vm.trips;
      vm.filterLength = vm.filteredItems.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.filteredItems.slice(begin, end);
    }

    vm.pageChanged = function() {
      vm.figureOutItemsToDisplay();
    }

    vm.buildPager();

    vm.sortTable = function(n) {
        var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
        table = document.getElementById("myTable2");
        switching = true;
        //Set the sorting direction to ascending:
        dir = "asc"; 
        /*Make a loop that will continue until
        no switching has been done:*/
        while (switching) {
            //start by saying: no switching is done:
            switching = false;
            rows = table.getElementsByTagName("TR");
            /*Loop through all table rows (except the
            first, which contains table headers):*/
            for (i = 1; i < (rows.length - 1); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            /*Get the two elements you want to compare,
            one from current row and one from the next:*/
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            /*check if the two rows should switch place,
            based on the direction, asc or desc:*/
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                //if so, mark as a switch and break the loop:
                shouldSwitch= true;
                break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                //if so, mark as a switch and break the loop:
                shouldSwitch= true;
                break;
                }
            }
            }
            if (shouldSwitch) {
            /*If a switch has been marked, make the switch
            and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            //Each time a switch is done, increase this count by 1:
            switchcount ++;      
            } else {
            /*If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again.*/
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
            }
        }
    }

    vm.isTripStartable = function(trip) {
      var status = vm.findTripStatus(trip);
      if(status == 'Upcoming' && moment(trip.trip_start_date).isSameOrBefore(moment(), 'day')) return true;
      return false;
    }

    $timeout(function() {
        for(var e=0; e<vm.allTrips.length; e++) {
          var temp = _.find(vm.bookings, function(o) {
            return vm.allTrips[e].booking_id == o.booking_id;
          });
          vm.allTrips[e].booking = temp;
          if(!vm.isUserAdmin){
            var isFound = false;
            for(var i=0; i<vm.allTrips[e].executive_id.length; i++) {
              if(vm.allTrips[e].executive_id[i]._id == vm.authentication.user._id) isFound = true;
            }
            if(!isFound) {
              vm.allTrips.splice(e, 1);
              e--;
            }
          }
        }
        vm.trips = angular.copy(vm.allTrips);        
        $scope.$apply();
    }, 1000);

  }
}());
