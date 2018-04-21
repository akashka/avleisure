'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  path = require('path'),
  config = require(path.resolve('./config/config')),
  chalk = require('chalk');

/**
 * Trip Schema
 */
var TripSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  trip_id: {
    type: String
  },
  booking_id: {
    type: String
  },
  executive_id: {
    type: String    
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  trip_start_date: {
    type: Date
  },
  trip_end_date: {
    type: Date
  },
  trip_start_by: {
    type: String
  },
  trip_end_by: {
    type: String
  },
  transactions: {
    type:Array
  }
});

TripSchema.statics.seed = seed;

mongoose.model('Trip', TripSchema);

/**
* Seeds the User collection with document (Trip)
* and provided options.
*/
function seed(doc, options) {
  var Trip = mongoose.model('Trip');

  return new Promise(function (resolve, reject) {

    skipDocument()
      .then(findAdminUser)
      .then(add)
      .then(function (response) {
        return resolve(response);
      })
      .catch(function (err) {
        return reject(err);
      });

    function findAdminUser(skip) {
      var User = mongoose.model('User');

      return new Promise(function (resolve, reject) {
        if (skip) {
          return resolve(true);
        }

        User
          .findOne({
            roles: { $in: ['admin'] }
          })
          .exec(function (err, admin) {
            if (err) {
              return reject(err);
            }

            doc.user = admin;

            return resolve();
          });
      });
    }

    function skipDocument() {
      return new Promise(function (resolve, reject) {
        Trip
          .findOne({
            title: doc.title
          })
          .exec(function (err, existing) {
            if (err) {
              return reject(err);
            }

            if (!existing) {
              return resolve(false);
            }

            if (existing && !options.overwrite) {
              return resolve(true);
            }

            // Remove Trip (overwrite)

            existing.remove(function (err) {
              if (err) {
                return reject(err);
              }

              return resolve(false);
            });
          });
      });
    }

    function add(skip) {
      return new Promise(function (resolve, reject) {
        if (skip) {
          return resolve({
            message: chalk.yellow('Database Seeding: Trip\t' + doc.title + ' skipped')
          });
        }

        var trip = new Trip(doc);

        trip.save(function (err) {
          if (err) {
            return reject(err);
          }

          return resolve({
            message: 'Database Seeding: Trip\t' + trip.title + ' added'
          });
        });
      });
    }
  });
}
