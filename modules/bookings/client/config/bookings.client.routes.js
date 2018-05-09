(function () {
  'use strict';

  angular
    .module('bookings.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('bookings', {
        abstract: true,
        url: '/bookings',
        template: '<ui-view/>'
      })
      .state('bookings.list', {
        url: '',
        templateUrl: '/modules/bookings/client/views/list-bookings.client.view.html',
        controller: 'BookingsListController',
        controllerAs: 'vm'
      })
      .state('bookings.create', {
        url: '/create',
        templateUrl: '/modules/bookings/client/views/form-booking.client.view.html',
        controller: 'BookingsAdminController',
        controllerAs: 'vm',
        resolve: {
          bookingResolve: newBooking
        }
      })
      .state('bookings.createnew', {
        url: '/create/:enquiryId',
        templateUrl: '/modules/bookings/client/views/form-booking.client.view.html',
        controller: 'BookingsAdminController',
        controllerAs: 'vm',
        resolve: {
          bookingResolve: newBooking
        }
      })
      .state('bookings.view', {
        url: '/:bookingId',
        templateUrl: '/modules/bookings/client/views/view-booking.client.view.html',
        controller: 'BookingsController',
        controllerAs: 'vm',
        resolve: {
          bookingResolve: getBooking
        },
        data: {
          pageTitle: '{{ bookingResolve.title }}'
        }
      })
      .state('bookings.edit', {
        url: '/:bookingId/edit',
        templateUrl: '/modules/bookings/client/views/form-booking.client.view.html',
        controller: 'BookingsAdminController',
        controllerAs: 'vm',
        resolve: {
          bookingResolve: getBooking
        },
        data: {
          pageTitle: '{{ bookingResolve.title }}'
        }
      })
      .state('bookings.expense', {
        url: '/:bookingId/add-expense',
        templateUrl: '/modules/bookings/client/views/add-expense.client.view.html',
        controller: 'BookingsAddExpenseController',
        controllerAs: 'vm',
        resolve: {
          bookingResolve: getBooking
        },
        data: {
          pageTitle: '{{ bookingResolve.title }}'
        }
      })
      
      .state('accounts', {
        abstract: true,
        url: '/accounts',
        template: '<ui-view/>'
      })
      .state('accounts.list', {
        url: '',
        templateUrl: '/modules/bookings/client/views/list-accounts.client.view.html',
        controller: 'AccountsListController',
        controllerAs: 'vm',
        resolve: {
          bookingResolve: getBooking
        },
        data: {
          pageTitle: '{{ bookingResolve.title }}'
        }
      });
  }

  getBooking.$inject = ['$stateParams', 'BookingsService'];

  function getBooking($stateParams, BookingsService) {
    return BookingsService.get({
      bookingId: $stateParams.bookingId
    });
  }

  newBooking.$inject = ['BookingsService'];

  function newBooking(bookingsService) {
    return new bookingsService();
  }

}());
