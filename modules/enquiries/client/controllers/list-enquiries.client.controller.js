(function () {
  'use strict';

  angular
    .module('enquiries')
    .controller('EnquiriesListController', EnquiriesListController);

  EnquiriesListController.$inject = ['EnquiriesService'];

  function EnquiriesListController(EnquiriesService) {
    var vm = this;

    vm.enquiries = EnquiriesService.query();
  }
}());
