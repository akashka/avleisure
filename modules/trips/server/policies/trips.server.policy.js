'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke trips Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/trips',
      permissions: '*'
    }, {
      resources: '/api/trips/create',
      permissions: '*'
    }, {
      resources: '/api/trips/:tripId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/trips',
       permissions: '*'
    }, {
      resources: '/api/trips/create',
       permissions: '*'
    }, {
      resources: '/api/trips/:tripId',
       permissions: '*'
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/trips',
       permissions: '*'
    }, {
      resources: '/api/trips/create',
       permissions: '*'
    }, {
      resources: '/api/trips/:tripId',
       permissions: '*'
    }]
  }]);
};

/**
 * Check If Enquiries Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an trip is being processed and the current user created it then allow any manipulation
  if (req.trip && req.user && req.trip.user && req.trip.user.id === req.user.id) {
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
