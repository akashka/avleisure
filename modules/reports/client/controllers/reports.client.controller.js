(function () {
  'use strict';

  angular
    .module('reports')
    .controller('ReportsController', ReportsController);

  ReportsController.$inject = ['BookingsService', '$state', 'UsersService', 'EnquiriesService', 'Authentication', 'TripsService', '$timeout'];

  function ReportsController(BookingsService, $state, UsersService, EnquiriesService, Authentication, TripsService, $timeout) {
    var vm = this;
		vm.users = UsersService.query();
		vm.enquiries = EnquiriesService.query();
		vm.bookings = BookingsService.query();
		vm.authentication = Authentication;
    vm.trips = TripsService.query();

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
    
    vm.findNoOfEnquiries = function(user) {
      var books = _.map(vm.enquiries, function(o) {
          var isFound = false;
          for(var e=0; e<o.enquiry_by.length; e++) {
            if(o.enquiry_by[e]._id == user._id) isFound = true;
          }
          if(isFound) return o;
      });
      for(var v=0; v<books.length; v++) {
        if(books[v] == undefined) {
          books.splice(v,1);
          v--;
        }
      }
      return books.length;
    }

    vm.findNoOfBookingsGot = function(user) {
      var books = _.map(vm.enquiries, function(o) {
          var isFound = false;
          for(var e=0; e<o.enquiry_by.length; e++) {
            if(o.enquiry_by[e]._id == user._id) isFound = true;
          }
          if(isFound) return o;
      });
      for(var v=0; v<books.length; v++) {
        if(books[v] == undefined) {
          books.splice(v,1);
          v--;
        }
      }
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

    vm.calculateBata = function(user) {
      var enq = 0;
      for(var o=0; o<vm.trips.length; o++) {
        if (_.includes(vm.trips[o].executive_id,user._id)) {
          for(var t=0; t<vm.trips[o].transactions.length; t++) {
            if(vm.trips[o].transactions[t].category == 'Tour Manager Expenses')
              enq += Number(vm.trips[o].transactions[t].amount);
          }
        }
      }
      return enq;
    }

    vm.calculateProfitLoss = function(user) {
      // calculate
    }

    vm.findNoOfTripsExecuted = function(user) {
      var enq = 0;
      for(var o=0; o<vm.trips.length; o++) {
        if (_.includes(vm.trips[o].executive_id,user._id)) {
          enq++;
        }
      }
      return enq;
    }

    vm.plotChart = function () {
        var displayData = [
            ['x'],
            ['enquiries'],
            ['bookings'],
            ['trips'],
            ['bata']
            // ['P and L']
        ];
        for(var i = 0; i < vm.users.length; i++) {
            displayData[0].push(vm.users[i].displayName);
            displayData[1].push(vm.findNoOfEnquiries(vm.users[i]));
            displayData[2].push(vm.findNoOfBookingsGot(vm.users[i]));
            displayData[3].push(vm.findNoOfTripsExecuted(vm.users[i]));
            displayData[4].push(vm.calculateBata(vm.users[i]));
            // displayData[4].push(vm.calculateProfitLoss(vm.users[i]));
        }
        vm.chart = c3.generate({
            bindto: '#user-report',
            data: {
                x : 'x',
                columns: displayData,
                names: {
                    x: '',
                    enquiries: 'Enquiries',
                    bookings: 'Bookings',
                    trips: 'Trips',
                    bata: 'Bata'
                    // 'P and L': 'P and L'
                },
                type: 'bar',
                labels: {
                  show: true
                },
                // colors: {
                //   enquiries: '#2f3540',
                //   bookings: '#f2ede5',
                //   trips: '#d9d1c7',
                //   bata: '#8c8581'
                //   // 'P and L': '#656973'
                // },               
            },
            bar: {
                space: 0,
                width: {
                    ratio: 0.6
                }
            },
            axis: {
                rotated: true, //cd.reverseGraph,
                x: {
                    type: 'category',
                    tick: {
                        count: 0,
                        outer: false
                    }
                },
                y: {
                    show: false
                }
            },
            point: {
                show: true,
                focus: {
                    expand: {
                        enabled: true
                    }
                }
            },
            legend: {
                show: true,
            },
            tooltip: {
                show: false,
            },
        });
    };

    $timeout(function () {
      vm.plotChart();
    }, 1000);


  }
}());
