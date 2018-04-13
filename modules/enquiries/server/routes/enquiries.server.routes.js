'use strict';

/**
 * Module dependencies
 */
var enquiriesPolicy = require('../policies/enquiries.server.policy'),
  enquiries = require('../controllers/enquiries.server.controller');

module.exports = function (app) {
  // Enquiries collection routes
  app.route('/api/enquiries').all(enquiriesPolicy.isAllowed)
    .get(enquiries.list)
    .post(enquiries.create);

  app.route('/api/enquiries/create').all(enquiriesPolicy.isAllowed)
    .get(enquiries.list)
    .post(enquiries.create);

  // Single enquiry routes
  app.route('/api/enquiries/:enquiryId').all(enquiriesPolicy.isAllowed)
    .get(enquiries.read)
    .put(enquiries.update)
    .delete(enquiries.delete);

  // Finish by binding the enquiry middleware
  app.param('enquiryId', enquiries.enquiryByID);
};
