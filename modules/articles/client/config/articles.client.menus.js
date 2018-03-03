(function () {
  'use strict';

  angular
    .module('articles')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Itineries',
      state: 'articles',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'articles', {
      title: 'List Itineries',
      state: 'articles.list',
      roles: ['*']
    });

    menuService.addSubMenuItem('topbar', 'articles', {
      title: 'Create Itineries',
      state: 'articles.create',
      roles: ['*']
    });

  }
}());
