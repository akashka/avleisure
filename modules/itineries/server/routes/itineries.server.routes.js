'use strict';

/**
 * Module dependencies
 */
var itineriesPolicy = require('../policies/itineries.server.policy'),
  itineries = require('../controllers/itineries.server.controller');

module.exports = function (app) {
  // Itineries collection routes
  app.route('/api/itineries')
    .get(itineries.list)
    .post(itineries.create);

  app.route('/api/itineries/create')
    .get(itineries.list)
    .post(itineries.create);

  // Single itinery routes
  app.route('/api/itineries/:itineryId')
    .get(itineries.read)
    .put(itineries.update)
    .delete(itineries.delete);

  app.route('/api/getCities/:alphacode')
    .get(itineries.getCities)

  // Finish by binding the itinery middleware
  app.param('itineryId', itineries.itineryByID);
};
