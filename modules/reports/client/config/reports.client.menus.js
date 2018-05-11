(function () {
  'use strict';

  angular
    .module('reports')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Reports',
      state: 'reports',
      roles: ['user', 'admin', 'marketing', 'executive'],
      position: 7
    });

  }
}());
