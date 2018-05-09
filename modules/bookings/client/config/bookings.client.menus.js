(function () {
  'use strict';

  angular
    .module('bookings')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Bookings',
      state: 'bookings',
      type: 'dropdown',
      roles: ['admin','user'],
      position: 4
    });

    menuService.addMenuItem('topbar', {
      title: 'Accounts',
      state: 'accounts',
      type: 'dropdown',
      roles: ['admin','user'],
      position: 6
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'bookings', {
      title: 'List Bookings',
      state: 'bookings.list',
      roles: ['*']
    });

    menuService.addSubMenuItem('topbar', 'bookings', {
      title: 'Create Bookings',
      state: 'bookings.create',
      roles: ['*']
    });


    menuService.addSubMenuItem('topbar', 'accounts', {
      title: 'List Accounts',
      state: 'accounts.list',
      roles: ['*']
    });

  }
}());
