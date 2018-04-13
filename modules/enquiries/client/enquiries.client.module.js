(function (app) {
  'use strict';

  app.registerModule('enquiries', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('enquiries.admin', ['core.admin']);
  app.registerModule('enquiries.admin.routes', ['core.admin.routes']);
  app.registerModule('enquiries.services');
  app.registerModule('enquiries.routes', ['ui.router', 'core.routes', 'enquiries.services']);
}(ApplicationConfiguration));
