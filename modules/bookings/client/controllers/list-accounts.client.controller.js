( function () {
	'use strict';
	angular.module( 'bookings' ).controller( 'AccountsListController', AccountsListController );
	AccountsListController.$inject = [ '$scope', '$state', '$window', 'bookingResolve', 'Authentication', 'Notification', 'BookingsService', 'EnquiriesService', 'UsersService', '$timeout', 'TripsService' ];

	function AccountsListController( $scope, $state, $window, booking, Authentication, Notification, BookingsService, EnquiriesService, UsersService, $timeout, TripsService ) {
		var vm = this;
		vm.users = UsersService.query();
		vm.enquiries = EnquiriesService.query();
		vm.bookings = BookingsService.query();
		vm.authentication = Authentication;
		vm.trips = TripsService.query();

		vm.convert = function (amount) {
			if(vm.booking.amount_paid === amount){
				vm.amount_paid = parseInt(vm.booking.amount_paid);
			}else if(vm.booking.booking_amount === amount){
				vm.booking_amount = parseInt(vm.booking.booking_amount);
			}
		}
	
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

		vm.calculatePaidAmount = function(amt) {
			var total = 0;
			for(var a=0; a<amt.length; a++) {
				total += Number(amt.amount_paid);
			}
			return total;
		}

		vm.calculatePendingAmount = function(amt, booked) {
			var total = 0;
			for(var a=0; a<amt.length; a++) {
				total += Number(amt.amount_paid);
			}
			return (Number(booked) - total);
		}

		vm.calculateExpenses = function(booking) {
			var total = 0;
			for(var i=0; i<booking.expenses.length; i++) {
				total += Number(booking.expenses[i].total_amount);
			}	
			return total;
		}

		vm.onTripExpenses = function(booking) {
			var total = 0;
			for(var i=0; i<vm.trips.length; i++) {
				if(vm.trips[i].booking_id == booking.booking_id) {
					for(var j=0; j<vm.trips[i].transactions.length; j++) {
						if(!vm.trips[i].transactions[j].credit) total += Number(vm.trips[i].transactions[j].amount);
					}
				}
			}
			return total;
		}
		
		vm.calculateBalance = function(booking) {
			var onTripExpense = 0;
			for(var i=0; i<vm.trips.length; i++) {
				if(vm.trips[i].booking_id == booking.booking_id) {
					for(var j=0; j<vm.trips[i].transactions.length; j++) {
						if(!vm.trips[i].transactions[j].credit) onTripExpense += Number(vm.trips[i].transactions[j].amount);
					}
				}
			}
			var expenses = 0;
			for(var i=0; i<booking.expenses.length; i++) {
				expenses += Number(booking.expenses[i].total_amount);
			}	
			return (Number(booking.booking_amount) - (onTripExpense + expenses));
		}

		vm.findName = function(tm) {
			for(var i=0; i<vm.users.length; i++) {
				if(vm.users[i]._id == tm) return vm.users[i].displayName;
			}
			return "";
		}

	}
}() );
