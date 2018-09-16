(function () {
	'use strict';
	angular.module('bookings').controller('AccountsListController', AccountsListController);
	AccountsListController.$inject = ['$scope', '$state', '$window', 'bookingResolve', 'Authentication', 'Notification', 'BookingsService', 'EnquiriesService', 'UsersService', '$timeout', 'TripsService', '$http'];

	function AccountsListController($scope, $state, $window, booking, Authentication, Notification, BookingsService, EnquiriesService, UsersService, $timeout, TripsService, $http) {
		var vm = this;
		vm.users = UsersService.query();
		vm.enquiries = EnquiriesService.query();
		vm.bookings = BookingsService.query();
		vm.authentication = Authentication;
		vm.trips = TripsService.query();

		vm.convert = function (amount) {
			if (vm.booking.amount_paid === amount) {
				vm.amount_paid = parseInt(vm.booking.amount_paid);
			} else if (vm.booking.booking_amount === amount) {
				vm.booking_amount = parseInt(vm.booking.booking_amount);
			}
		}

		vm.sortTable = function (n) {
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
							shouldSwitch = true;
							break;
						}
					} else if (dir == "desc") {
						if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
							//if so, mark as a switch and break the loop:
							shouldSwitch = true;
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
					switchcount++;
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

		vm.calculatePaidAmount = function (amt) {
			var total = 0;
			for (var a = 0; a < amt.length; a++) {
				total += Number(amt[a].amount_paid);
			}
			return total;
		}

		vm.calculatePendingAmount = function (amt, booked) {
			var total = 0;
			for (var a = 0; a < amt.length; a++) {
				total += Number(amt[a].amount_paid);
			}
			return (Number(booked) - total);
		}

		vm.calculateExpenses = function (booking) {
			var total = 0;
			for (var i = 0; i < booking.expenses.length; i++) {
				total += Number(booking.expenses[i].total_amount);
			}
			return total;
		}

		vm.onTripExpenses = function (booking) {
			var total = 0;
			for (var i = 0; i < vm.trips.length; i++) {
				if (vm.trips[i].booking_id == booking.booking_id) {
					for (var j = 0; j < vm.trips[i].transactions.length; j++) {
						if (!vm.trips[i].transactions[j].credit) total += Number(vm.trips[i].transactions[j].amount);
					}
				}
			}
			return total;
		}

		vm.calculateBalance = function (booking) {
			var onTripExpense = 0;
			for (var i = 0; i < vm.trips.length; i++) {
				if (vm.trips[i].booking_id == booking.booking_id) {
					for (var j = 0; j < vm.trips[i].transactions.length; j++) {
						if (!vm.trips[i].transactions[j].credit) onTripExpense += Number(vm.trips[i].transactions[j].amount);
					}
				}
			}
			var expenses = 0;
			for (var i = 0; i < booking.expenses.length; i++) {
				expenses += Number(booking.expenses[i].total_amount);
			}
			return (Number(booking.total_booking_amount) - (onTripExpense + expenses));
		}

		vm.findName = function (tm) {
			for (var i = 0; i < vm.users.length; i++) {
				if (vm.users[i]._id == tm) return vm.users[i].displayName;
			}
			return "";
		}

		vm.printBill = function (id) {
			var fileurl = "/api/downloadBill/" + id;
			window.open(fileurl, '_blank', '');
		}

		$(document).ready(function () {
			var totalRows = $('#myTable2').find('tbody tr:has(td)').length;
			var recordPerPage = 8;
			var totalPages = Math.ceil(totalRows / recordPerPage);
			var $pages = $('<div id="pages"></div>');
			for (i = 0; i < totalPages; i++) {
				$('<span>&nbsp;' + (i + 1) + '</span>').appendTo($pages);
			}
			$pages.appendTo('#myTable2');
			$('.pageNumber').hover(function () {
				$(this).addClass('focus');
			}, function () {
				$(this).removeClass('focus');
			});
			$('table').find('tbody tr:has(td)').hide();
			var tr = $('table tbody tr:has(td)');
			for (var i = 0; i <= recordPerPage - 1; i++) {
				$(tr[i]).show();
			}
			$('span').click(function (event) {
				$("#pages>span").removeClass("active");
				$(this).addClass('active');
				$('#myTable2').find('tbody tr:has(td)').hide();
				var nBegin = ($(this).text() - 1) * recordPerPage;
				var nEnd = $(this).text() * recordPerPage - 1;
				for (var i = nBegin; i <= nEnd; i++) {
					$(tr[i]).show();
				}
			});
		});

	}
}());
