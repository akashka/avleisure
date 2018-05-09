(function () {
  'use strict';

  angular
    .module('users.admin')
    .controller('UserListController', UserListController);

  UserListController.$inject = ['$scope', '$filter', 'AdminService', 'EnquiriesService', 'BookingsService'];

  function UserListController($scope, $filter, AdminService, EnquiriesService, BookingsService) {
    var vm = this;
    vm.enquiries = EnquiriesService.query();
    vm.bookings = BookingsService.query();

    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;

    AdminService.query(function (data) {
      vm.users = data;
      vm.buildPager();
    });

    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 15;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }

    function figureOutItemsToDisplay() {
      vm.filteredItems = $filter('filter')(vm.users, {
        $: vm.search
      });
      vm.filterLength = vm.filteredItems.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.filteredItems.slice(begin, end);
    }

    function pageChanged() {
      vm.figureOutItemsToDisplay();
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
