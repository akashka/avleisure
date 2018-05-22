'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Itinery = mongoose.model('Itinery'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an itinery
 */
exports.create = function (req, res) {
  var itinery = new Itinery(req.body);
  itinery.user = req.user;

  itinery.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(itinery);
    }
  });
};

/**
 * Show the current itinery
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var itinery = req.itinery ? req.itinery.toJSON() : {};

  // Add a custom field to the Itinery, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Itinery model.
  itinery.isCurrentUserOwner = !!(req.user && itinery.user && itinery.user._id.toString() === req.user._id.toString());

  res.json(itinery);
};

/**
 * Update an itinery
 */
exports.update = function (req, res) {
  var itinery = req.itinery;

  itinery.title = req.body.title;
  itinery.content = req.body.content;
  itinery.description = req.body.description;
  itinery.sstate = req.body.sstate;
  itinery.plan = req.body.plan;
  itinery.nights = req.body.nights;
  itinery.days = req.body.days;
  itinery.international = req.body.international;
  itinery.package_type = req.body.package_type;

  itinery.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(itinery);
    }
  });
};

/**
 * Delete an itinery
 */
exports.delete = function (req, res) {
  var itinery = req.itinery;

  itinery.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(itinery);
    }
  });
};

/**
 * List of Itineries
 */
exports.list = function (req, res) {
  Itinery.find().sort('-created').populate('user', 'displayName').exec(function (err, itineries) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(itineries);
    }
  });
};

/**
 * Itinery middleware
 */
exports.itineryByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Itinery is invalid'
    });
  }

  Itinery.findById(id).populate('user', 'displayName').exec(function (err, itinery) {
    if (err) {
      return next(err);
    } else if (!itinery) {
      return res.status(404).send({
        message: 'No itinery with that identifier has been found'
      });
    }
    req.itinery = itinery;
    next();
  });
};

exports.getCities = function(req, res, next, id) {
        var req = {
          method: 'GET',
          url: 'http://services.groupkt.com/state/get/' + req.alphacode + '/all',
          headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
          }
        }
        $http(req).then(function(result){
            vm.allStates = result.RestResponse.result; 
        }, function(error){
              console.log(error);
        });
}