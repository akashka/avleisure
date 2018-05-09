(function () {
  'use strict';

  angular
    .module('enquiries')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Enquiries',
      state: 'enquiries',
      type: 'dropdown',
      roles: ['admin','user'],
      position: 3
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'enquiries', {
      title: 'List Enquiries',
      state: 'enquiries.list',
      roles: ['admin']
    });

    menuService.addSubMenuItem('topbar', 'enquiries', {
      title: 'Create Enquiries',
      state: 'enquiries.create',
      roles: ['*']
    });

    menuService.addSubMenuItem('topbar', 'enquiries', {
      title: 'Quotations',
      state: 'quotations',
      roles: ['admin','user']
    });

  }
}());
