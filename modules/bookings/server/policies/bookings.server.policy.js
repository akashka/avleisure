'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke bookings Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['user', 'admin', 'marketing', 'executive'],
    allows: [{
      resources: '/api/bookings',
      permissions: '*'
    }, {
      resources: '/api/bookings/create',
      permissions: '*'
    }, {
      resources: '/api/bookings/:bookingId',
      permissions: '*'
    }]
  }, {
    roles: ['user', 'admin', 'marketing', 'executive'],
    allows: [{
      resources: '/api/bookings',
       permissions: '*'
    }, {
      resources: '/api/bookings/create',
       permissions: '*'
    }, {
      resources: '/api/bookings/:bookingId',
       permissions: '*'
    }]
  }, {
    roles: ['user', 'admin', 'marketing', 'executive'],
    allows: [{
      resources: '/api/bookings',
       permissions: '*'
    }, {
      resources: '/api/bookings/create',
       permissions: '*'
    }, {
      resources: '/api/bookings/:bookingId',
       permissions: '*'
    }]
  }]);
};

/**
 * Check If bookings Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an bookings is being processed and the current user created it then allow any manipulation
  if (req.booking && req.user && req.booking.user && req.booking.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
