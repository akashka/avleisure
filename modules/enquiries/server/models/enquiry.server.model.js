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
 * Enquiry Schema
 */
var EnquirySchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  school_name: {
    type: String
  },
  school_address: {
    type: String
  },
  school_gprs: {
    type: String
  },
  school_photo: {
    type: String
  },
  school_email_id: {
    type: String
  },
  itineries: {
    type: String
  },
  school_phone_no: {
    type: String
  },
  school_contact_person: {
    type: String    
  },
  school_class: {
    type: String    
  },
  transport: {
    type: String 
  },
  food:{
    type: String
  },
  sharing: {
    type: String
  },
  accomodation: {
    type: String    
  },
  quotations: {
    type: Array
  },
  bookings: {
    type: Array    
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

EnquirySchema.statics.seed = seed;

mongoose.model('Enquiry', EnquirySchema);

/**
* Seeds the User collection with document (Enquiry)
* and provided options.
*/
function seed(doc, options) {
  var Enquiry = mongoose.model('Enquiry');

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
        Enquiry
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

            // Remove Enquiry (overwrite)

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
            message: chalk.yellow('Database Seeding: Enquiry\t' + doc.title + ' skipped')
          });
        }

        var enquiry = new Enquiry(doc);

        enquiry.save(function (err) {
          if (err) {
            return reject(err);
          }

          return resolve({
            message: 'Database Seeding: Enquiry\t' + enquiry.title + ' added'
          });
        });
      });
    }
  });
}
