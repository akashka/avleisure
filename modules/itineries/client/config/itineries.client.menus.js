(function () {
  'use strict';

  angular
    .module('itineries')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Itineries',
      state: 'itineries',
      type: 'dropdown',
      roles: ['user', 'admin', 'marketing'],
      position: 2
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'itineries', {
      title: 'List Itineries',
      state: 'itineries.list',
      roles: ['*']
    });

    menuService.addSubMenuItem('topbar', 'itineries', {
      title: 'Create Itineries',
      state: 'itineries.create',
      roles: ['admin']
    });

  }
}());
