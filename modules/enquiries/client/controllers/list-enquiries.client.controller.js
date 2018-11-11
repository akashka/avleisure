(function () {
  'use strict';

  angular
    .module('enquiries')
    .controller('EnquiriesListController', EnquiriesListController);

  EnquiriesListController.$inject = ['EnquiriesService', '$state', 'Authentication', 'BookingsService'];

  function EnquiriesListController(EnquiriesService, $state, Authentication, BookingsService) {
    var vm = this;

    vm.enquiries = EnquiriesService.query();
    vm.allEnquiries = EnquiriesService.query();
    vm.allBookings = BookingsService.query();
    vm.authentication = Authentication;
    vm.isUserAdmin = vm.authentication.user.roles.includes('admin');
    vm.search = {
      enquiry_id: "",
      school_name: ""
    }

    vm.searches = function () {
      vm.enquiries = vm.allEnquiries;
      var searched = [];
      for (var e = 0; e < vm.enquiries.length; e++) {
        if (vm.search.enquiry_id != null && vm.search.enquiry_id != undefined && vm.search.enquiry_id != "" &&
          (vm.search.school_name == null || vm.search.school_name == undefined || vm.search.school_name == "") &&
          vm.search.enquiry_id == vm.enquiries[e].enquiry_id) {
          searched.push(vm.enquiries[e]);
        }
        else if ((vm.search.enquiry_id == null || vm.search.enquiry_id == undefined || vm.search.enquiry_id == "") &&
          vm.search.school_name != null && vm.search.school_name != undefined && vm.search.school_name != "" &&
          vm.search.school_name.toLowerCase() == vm.enquiries[e].school_name.toLowerCase()) {
          searched.push(vm.enquiries[e]);
        }
        else if (vm.search.enquiry_id != null && vm.search.enquiry_id != undefined && vm.search.enquiry_id != "" &&
          vm.search.school_name != null && vm.search.school_name != undefined && vm.search.school_name != "" &&
          vm.search.school_name.toLowerCase() == vm.enquiries[e].school_name.toLowerCase() &&
          vm.search.enquiry_id == vm.enquiries[e].enquiry_id) {
          searched.push(vm.enquiries[e]);
        }
      }
      vm.enquiries = searched;
    }

    vm.reset = function () {
      vm.enquiries = vm.allEnquiries;
      vm.search = {
        enquiry_id: "",
        school_name: ""
      };
      // vm.lr_from = {isOpened: false};
      // vm.lr_to = {isOpened: false};
    }

    vm.gotoNewEnquiry = function () {
      $state.go('enquiries.create');
    }

    vm.buildPager = function () {
      vm.pagedItems = [];
      vm.itemsPerPage = 15;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }

    vm.figureOutItemsToDisplay = function () {
      vm.filteredItems = vm.enquiries;
      vm.filterLength = vm.filteredItems.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.filteredItems.slice(begin, end);
    }

    vm.pageChanged = function () {
      vm.figureOutItemsToDisplay();
    }

    vm.buildPager();

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

    vm.findBackgroundClass = function (enquiry) {
      var isQuotationGiven = false;
      var isBookingDone = false;
      for (var e = 0; e < enquiry.enquiries.length; e++) {
        if (enquiry.enquiries[e].quotations != undefined && enquiry.enquiries[e].quotations != null){
          if(enquiry.enquiries[e].quotations.length >= 0) isQuotationGiven = true;
        }
      }
      var enq = _.find(vm.allBookings, function (o) {
        return o.enquiry_id == enquiry.enquiry_id
      });
      if (enq != undefined) isBookingDone = true;
      if (isBookingDone) return "booked";
      else if (isQuotationGiven) return "followup";
      else return "quotation";
    }

    vm.countSimilarSchool = function (school_name) {
      var found = _.filter(vm.allEnquiries, function (o) {
        return o.school_name == school_name
      });
      if (found.length - 1 <= 0) return '';
      return found.length - 1;
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
