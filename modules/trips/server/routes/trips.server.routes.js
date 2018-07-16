'use strict';

/**
 * Module dependencies
 */
var tripsPolicy = require('../policies/trips.server.policy'),
  trips = require('../controllers/trips.server.controller');

module.exports = function (app) {
  // Trips collection routes
  app.route('/api/trips')
    .get(trips.list)
    .post(trips.create);

  app.route('/api/trips/create')
    .get(trips.list)
    .post(trips.create);

  // Single trip routes
  app.route('/api/trips/:tripId')
    .get(trips.read)
    .put(trips.update)
    .delete(trips.delete);

  // Finish by binding the trip middleware
  app.param('tripId', trips.tripByID);
};
