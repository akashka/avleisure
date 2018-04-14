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
 * bookings Schema
 */
var BookingSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  enquiry_id: {
    type: String,
    default: '',
    required: 'Enquiry No. cannot be blank'
  },
  booking_id: {
    type: String,
    default: '',
    required: 'Booking id cannot be blank'
  },
  booking_date: {
    type: Date
  },
  booking_amount: {
    type: String
  },
  school_name: {
    type: String
  },
  contact_person: {
    type: String
  },
  contact_destination: {
    type: String
  },
  contact_phone: {
    type: String
  },
  contact_email: {
    type: String
  },
  amount_paid: {
    type: Array
  },
  no_of_students: {
    type: String
  },
  no_of_staff: {
    type: String
  },
  class: {
    type: String
  },
  tour_managers: {
    type: Array
  },
  destination: {
    type: String
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

BookingSchema.statics.seed = seed;

mongoose.model('Booking', BookingSchema);

/**
* Seeds the User collection with document (Booking)
* and provided options.
*/
function seed(doc, options) {
  var Booking = mongoose.model('Booking');

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
        Booking
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

            // Remove Booking (overwrite)

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
            message: chalk.yellow('Database Seeding: Booking\t' + doc.title + ' skipped')
          });
        }

        var booking = new Booking(doc);

        booking.save(function (err) {
          if (err) {
            return reject(err);
          }

          return resolve({
            message: 'Database Seeding: Booking\t' + booking.title + ' added'
          });
        });
      });
    }
  });
}
