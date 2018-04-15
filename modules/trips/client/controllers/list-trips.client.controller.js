(function () {
  'use strict';

  angular
    .module('trips')
    .controller('TripsListController', TripsListController);

  TripsListController.$inject = ['TripsService', '$state'];

  function TripsListController(TripsService, $state) {
    var vm = this;

    vm.trips = TripsService.query();
    vm.allTrips = TripsService.query();

    vm.search = {
      trip_id: "",
      school_name: ""
    }

    vm.searches = function() {
        vm.trips = vm.allTrips;
        var searched = [];
        for(var e=0; e<vm.trips.length;e++) {
          if(vm.search.trip_id != null && vm.search.trip_id != undefined && vm.search.trip_id != "" &&
              (vm.search.school_name == null || vm.search.school_name == undefined || vm.search.school_name == "") &&
              vm.search.trip_id == vm.trips[e].trip_id) {
                    searched.push(vm.trips[e]);
          }
          else if((vm.search.trip_id == null || vm.search.trip_id == undefined || vm.search.trip_id == "") && 
              vm.search.school_name != null && vm.search.school_name != undefined && vm.search.school_name != "" &&
              vm.search.school_name.toLowerCase() == vm.trips[e].school_name.toLowerCase()) {
                    searched.push(vm.trips[e]);
          }
          else if(vm.search.trip_id != null && vm.search.trip_id != undefined && vm.search.trip_id != "" &&
              vm.search.school_name != null && vm.search.school_name != undefined && vm.search.school_name != "" &&
              vm.search.school_name.toLowerCase() == vm.trips[e].school_name.toLowerCase() && 
              vm.search.trip_id == vm.trips[e].trip_id) {
                    searched.push(vm.trips[e]);
          }
        }
        vm.trips = searched;
    }

    vm.reset = function() {
      vm.trips = vm.allTrips;
      vm.search = {
        trip_id: "",
        school_name: ""
      };
      // vm.lr_from = {isOpened: false};
      // vm.lr_to = {isOpened: false}; 
    }

    vm.gotoNewTrip = function() {
        $state.go('trips.create');
    }

    // vm.lr_from = {isOpened: false};
    // vm.lr_to = {isOpened: false}; 

    // vm.selectDate = function($event, num) {
    //   if(num == 1) { vm.lr_from.isOpened = true; }
    //   if(num == 2) { vm.lr_to.isOpened = true; }
    // };
    
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

  }
}());
