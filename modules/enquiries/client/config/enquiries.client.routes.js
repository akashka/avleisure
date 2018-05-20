(function () {
  'use strict';

  angular
    .module('enquiries.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('enquiries', {
        abstract: true,
        url: '/enquiries',
        template: '<ui-view/>'
      })
      .state('quotations', {
        url: '/quotations',
        templateUrl: '/modules/enquiries/client/views/quotations.client.view.html',
        controller: 'QuotationsController',
        controllerAs: 'vm'
      })
      .state('quotations.view', {
        url: '/quotations/:enquiryId',
        templateUrl: '/modules/enquiries/client/views/quotations.client.view.html',
        controller: 'QuotationsController',
        controllerAs: 'vm'
      })
      .state('enquiries.list', {
        url: '',
        templateUrl: '/modules/enquiries/client/views/list-enquiries.client.view.html',
        controller: 'EnquiriesListController',
        controllerAs: 'vm'
      })
      .state('enquiries.create', {
        url: '/create',
        templateUrl: '/modules/enquiries/client/views/form-enquiry.client.view.html',
        controller: 'EnquiriesAdminController',
        controllerAs: 'vm',
        resolve: {
          enquiryResolve: newEnquiry
        }
      })
      .state('enquiries.view', {
        url: '/:enquiryId',
        templateUrl: '/modules/enquiries/client/views/view-enquiry.client.view.html',
        controller: 'EnquiriesController',
        controllerAs: 'vm',
        resolve: {
          enquiryResolve: getEnquiry
        },
        data: {
          pageTitle: '{{ enquiryResolve.title }}'
        }
      })
      .state('enquiries.edit', {
        url: '/:enquiryId/edit',
        templateUrl: '/modules/enquiries/client/views/form-enquiry.client.view.html',
        controller: 'EnquiriesAdminController',
        controllerAs: 'vm',
        resolve: {
          enquiryResolve: getEnquiry
        },
        data: {
          pageTitle: '{{ enquiryResolve.title }}'
        }
      })
      .state('enquiries.followup', {
        url: '/:enquiryId/followup',
        templateUrl: '/modules/enquiries/client/views/followup-enquiry.client.view.html',
        controller: 'EnquiriesFollowupController',
        controllerAs: 'vm',
        resolve: {
          enquiryResolve: getEnquiry
        },
        data: {
          pageTitle: '{{ enquiryResolve.title }}'
        }
      });
  }

  getEnquiry.$inject = ['$stateParams', 'EnquiriesService'];

  function getEnquiry($stateParams, EnquiriesService) {
    return EnquiriesService.get({
      enquiryId: $stateParams.enquiryId
    });
  }

  newEnquiry.$inject = ['EnquiriesService'];

  function newEnquiry(EnquiriesService) {
    return new EnquiriesService();
  }

}());
