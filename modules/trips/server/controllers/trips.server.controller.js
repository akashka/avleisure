'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Trip = mongoose.model('Trip'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an trip
 */
exports.create = function (req, res) {
  var trip = new Trip(req.body);
  trip.user = req.user;

  trip.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(trip);
    }
  });
};

/**
 * Show the current trip
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var trip = req.trip ? req.trip.toJSON() : {};

  // Add a custom field to the Trip, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Trip model.
  trip.isCurrentUserOwner = !!(req.user && trip.user && trip.user._id.toString() === req.user._id.toString());

  res.json(trip);
};

/**
 * Update an trip
 */
exports.update = function (req, res) {
  var trip = req.trip;

  trip.user = req.body.user ;
  trip.executive_id = req.body.executive_id ;
  trip.trip_start_date = req.body.trip_start_date ;
  trip.booking_id = req.body.booking_id ;
  trip.trip_id = req.body.trip_id ;
  trip.trip_start_by = req.body.trip_start_by ;
  trip.transactions = req.body.transactions ;
  trip.trip_end_by = req.body.trip_end_by ;
  trip.trip_end_date = req.body.trip_end_date ;
  
  trip.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(trip);
    }
  });
};

/**
 * Delete an trip
 */
exports.delete = function (req, res) {
  var trip = req.trip;

  trip.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(trip);
    }
  });
};

/**
 * List of Enquiries
 */
exports.list = function (req, res) {
  Trip.find().sort('-created').populate('user', 'displayName').exec(function (err, enquiries) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(enquiries);
    }
  });
};

/**
 * Trip middleware
 */
exports.tripByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Trip is invalid'
    });
  }

  Trip.findById(id).populate('user', 'displayName').exec(function (err, trip) {
    if (err) {
      return next(err);
    } else if (!trip) {
      return res.status(404).send({
        message: 'No trip with that identifier has been found'
      });
    }
    req.trip = trip;
    next();
  });
};
