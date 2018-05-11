(function () {
  'use strict';

  angular
    .module('trips')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Trips',
      state: 'trips',
      type: 'dropdown',
      roles: ['admin', 'executive'],
      position: 5
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'trips', {
      title: 'List Trips',
      state: 'trips.list',
      roles: ['*']
    });
    menuService.addSubMenuItem('topbar', 'trips', {
      title: 'Start Trip',
      state: 'trips.start',
      roles: ['admin']
    });
    menuService.addSubMenuItem('topbar', 'trips', {
      title: 'End Trip',
      state: 'trips.end',
      roles: []
    });
    menuService.addSubMenuItem('topbar', 'trips', {
      title: 'Add Expense',
      state: 'trips.add-expenses',
      roles: []
    });
    menuService.addSubMenuItem('topbar', 'trips', {
      title: 'Add Balance',
      state: 'trips.add-balance',
      roles: []
    });
    menuService.addSubMenuItem('topbar', 'trips', {
      title: 'View PassBook',
      state: 'trips.view-passbook',
      roles: []
    });

  }
}());
