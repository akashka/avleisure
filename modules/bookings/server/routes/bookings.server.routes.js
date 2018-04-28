'use strict';

/**
 * Module dependencies
 */
var bookingsPolicy = require('../policies/bookings.server.policy'),
  bookings = require('../controllers/bookings.server.controller');

module.exports = function (app) {
  // Bookings collection routes
  app.route('/api/bookings').all(bookingsPolicy.isAllowed)
    .get(bookings.list)
    .post(bookings.create);

  app.route('/api/bookings/create').all(bookingsPolicy.isAllowed)
    .get(bookings.list)
    .post(bookings.create);

  // Single bookings routes
  app.route('/api/bookings/:bookingId').all(bookingsPolicy.isAllowed)
    .get(bookings.read)
    .put(bookings.update)
    .delete(bookings.delete);

  // Finish by binding the booking middleware
  app.param('bookingId', bookings.bookingByID);
};