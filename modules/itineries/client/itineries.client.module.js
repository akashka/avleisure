(function (app) {
  'use strict';

  app.registerModule('itineries', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('itineries.admin', ['core.admin']);
  app.registerModule('itineries.admin.routes', ['core.admin.routes']);
  app.registerModule('itineries.services');
  app.registerModule('itineries.routes', ['ui.router', 'core.routes', 'itineries.services']);
}(ApplicationConfiguration));
