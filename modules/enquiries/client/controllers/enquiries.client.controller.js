(function () {
  'use strict';

  angular
    .module('enquiries')
    .controller('EnquiriesController', EnquiriesController);

  EnquiriesController.$inject = ['$scope', 'enquiryResolve', 'Authentication'];

  function EnquiriesController($scope, enquiry, Authentication) {
    var vm = this;

    vm.enquiry = enquiry;
    vm.authentication = Authentication;

  }
}());
