'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Enquiry = mongoose.model('Enquiry'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an enquiry
 */
exports.create = function (req, res) {
  var enquiry = new Enquiry(req.body);
      enquiry.user = req.user;
      enquiry.save(function (err) {
        if (err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(enquiry);
        }
      });
};

/**
 * Show the current enquiry
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var enquiry = req.enquiry ? req.enquiry.toJSON() : {};

  // Add a custom field to the Enquiry, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Enquiry model.
  enquiry.isCurrentUserOwner = !!(req.user && enquiry.user && enquiry.user._id.toString() === req.user._id.toString());

  res.json(enquiry);
};

/**
 * Update an enquiry
 */
exports.update = function (req, res) {
  var enquiry = req.enquiry;

  // enquiry._id = req.body._id;
  enquiry.user  = req.body.user;
  enquiry.enquiry_id = req.body.enquiry_id;
  enquiry.school_name = req.body.school_name;
  enquiry.school_address = req.body.school_address;
  enquiry.school_gprs = req.body.school_gprs;
  enquiry.school_photo = req.body.school_photo;
  enquiry.school_email_id = req.body.school_email_id;
  enquiry.school_phone_no = req.body.school_phone_no;
  enquiry.enquiries = req.body.enquiries;

  enquiry.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(enquiry);
    }
  });
};

/**
 * Delete an enquiry
 */
exports.delete = function (req, res) {
  var enquiry = req.enquiry;

  enquiry.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(enquiry);
    }
  });
};

/**
 * List of Enquiries
 */
exports.list = function (req, res) {
  Enquiry.find().sort('-created').populate('user', 'displayName').exec(function (err, enquiries) {
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
 * Enquiry middleware
 */
exports.enquiryByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Enquiry is invalid'
    });
  }

  Enquiry.findById(id).populate('user', 'displayName').exec(function (err, enquiry) {
    if (err) {
      return next(err);
    } else if (!enquiry) {
      return res.status(404).send({
        message: 'No enquiry with that identifier has been found'
      });
    }
    req.enquiry = enquiry;
    next();
  });
};
