(function () {
  'use strict';

  angular
    .module('bookings')
    .controller('BookingsListController', BookingsListController);

  BookingsListController.$inject = ['BookingsService','$state','TripsService'];

  function BookingsListController(BookingsService,$state,TripsService) {
    var vm = this;

    vm.bookings = BookingsService.query();
    vm.allBookings = BookingsService.query();
    vm.allTrips = TripsService.query();

    vm.search = {
      booking_id: "",
      school_name: ""
    }

    vm.searches = function() {
        vm.bookings = vm.allBookings;
        var searched = [];
        for(var e=0; e<vm.bookings.length;e++) {
          if(vm.search.booking_id != null && vm.search.booking_id != undefined && vm.search.booking_id != "" &&
              (vm.search.school_name == null || vm.search.school_name == undefined || vm.search.school_name == "") &&
              vm.search.booking_id == vm.bookings[e].booking_id) {
                    searched.push(vm.bookings[e]);
          }
          else if((vm.search.booking_id == null || vm.search.booking_id == undefined || vm.search.booking_id == "") &&
              vm.search.school_name != null && vm.search.school_name != undefined && vm.search.school_name != "" &&
              vm.search.school_name.toLowerCase() == vm.bookings[e].school_name.toLowerCase()) {
                    searched.push(vm.bookings[e]);
          }
          else if(vm.search.booking_id != null && vm.search.booking_id != undefined && vm.search.booking_id != "" &&
              vm.search.school_name != null && vm.search.school_name != undefined && vm.search.school_name != "" &&
              vm.search.school_name.toLowerCase() == vm.bookings[e].school_name.toLowerCase() &&
              vm.search.booking_id == vm.bookings[e].booking_id) {
                    searched.push(vm.bookings[e]);
          }
        }
        vm.bookings = searched;
    }

    vm.reset = function() {
      vm.bookings = vm.allBookings;
      vm.search = {
        booking_id: "",
        school_name: ""
      };
      // vm.lr_from = {isOpened: false};
      // vm.lr_to = {isOpened: false};
    }

    vm.gotoNewBooking = function() {
        $state.go('bookings.create');
    }

    vm.buildPager = function() {
      vm.pagedItems = [];
      vm.itemsPerPage = 15;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }

    vm.figureOutItemsToDisplay = function() {
      vm.filteredItems = vm.bookings;
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

    vm.calculateDiff = function(sdate) {
      var date2 = new Date();
      var date1 = new Date(sdate);
      var timeDiff = Math.abs(date2.getTime() - date1.getTime());
      return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }

    var calulateBreakupDiff = function(sdate) {
      var date2 = new Date();
      var date1 = new Date(sdate);
      var timeDiff = Math.abs(date2.getTime() - date1.getTime()) / 1000;
      var df = Math.ceil(timeDiff / 3600);
      return df;      
    }

    vm.calculateSmartRemark = function(booking) {
      var trip = _.find(vm.allTrips, function(o) {
          return o.booking_id == booking.booking_id
      });
      var isTripOn = false;
      var isTripCompleted = false;
      if(trip != undefined) {
        if(trip.trip_end_date != undefined && trip.trip_end_date != null && trip.trip_end_date != ""
        && trip.trip_end_by != undefined && trip.trip_end_by != null && trip.trip_end_by != "")
          isTripCompleted = true;
        if(trip.trip_started) isTripOn = true;
      }
      var dayDiff = vm.calculateDiff(booking.booking_date);
      dayDiff--;
      if(isTripCompleted) return("Trip is completed"); 
      if(isTripOn) return("Trip is ongoing");
      if(dayDiff >= 1) return ("Trip starts in " + dayDiff + " days");
      if(dayDiff <= -1) return ("Trip didnt start");
      if(dayDiff == 0) {
        var df = calulateBreakupDiff(booking.booking_date);
        return ("Trip starts in " + df + " hours ");
      }
    }

  }
}());
