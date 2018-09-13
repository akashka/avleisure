'use strict';

/**
 * Module dependencies
 */
var enquiriesPolicy = require('../policies/enquiries.server.policy'),
  enquiries = require('../controllers/enquiries.server.controller');

module.exports = function (app) {
  // Enquiries collection routes
  app.route('/api/enquiries')
    .get(enquiries.list)
    .post(enquiries.create);

  app.route('/api/enquiries/create')
    .get(enquiries.list)
    .post(enquiries.create);

  // Single enquiry routes
  app.route('/api/enquiries/:enquiryId')
    .get(enquiries.read)
    .put(enquiries.update)
    .delete(enquiries.delete);

  app.route('/api/enquiries/sendEmailSms')
    .post(enquiries.sendEmailSms);

  app.route('/api/enquiries/sendQuotations')
    .post(enquiries.sendQuotations);

  // Finish by binding the enquiry middleware
  app.param('enquiryId', enquiries.enquiryByID);
};
