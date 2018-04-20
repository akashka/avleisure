(function (app) {
  'use strict';

  app.registerModule('trips', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('trips.admin', ['core.admin']);
  app.registerModule('trips.admin.routes', ['core.admin.routes']);
  app.registerModule('trips.services');
  app.registerModule('trips.routes', ['ui.router', 'core.routes', 'trips.services']);
}(ApplicationConfiguration));
