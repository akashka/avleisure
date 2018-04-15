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
      roles: ['admin','user']
    });

    

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'trips', {
      title: 'List Trips',
      state: 'trips.list',
      roles: ['*']
    });
    menuService.addSubMenuItem('topbar', 'trips', {
      title: 'Start Trips',
      state: 'trips.start',
      roles: ['*']
    });
    menuService.addSubMenuItem('topbar', 'trips', {
      title: 'End Trips',
      state: 'trips.end',
      roles: ['*']
    });
    menuService.addSubMenuItem('topbar', 'trips', {
      title: 'Add Expenses',
      state: 'trips.add-expenses',
      roles: ['*']
    });
    menuService.addSubMenuItem('topbar', 'trips', {
      title: 'View PassBook',
      state: 'trips.view-passbook',
      roles: ['*']
    });

  }
}());
