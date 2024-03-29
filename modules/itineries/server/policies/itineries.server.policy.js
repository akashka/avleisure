'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke itineries Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/itineries',
      permissions: '*'
    }, {
      resources: '/api/itineries/create',
      permissions: '*'
    }, {
      resources: '/api/itineries/:itineryId',
      permissions: '*'
    },{
      resources: '/api/getCities/:alphacode',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/itineries',
       permissions: '*'
    }, {
      resources: '/api/itineries/create',
       permissions: '*'
    }, {
      resources: '/api/itineries/:itineryId',
       permissions: '*'
    }, {
      resources: '/api/getCities/:alphacode',
      permissions: '*'
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/itineries',
       permissions: '*'
    }, {
      resources: '/api/itineries/create',
       permissions: '*'
    }, {
      resources: '/api/itineries/:itineryId',
       permissions: '*'
    }, {
      resources: '/api/getCities/:alphacode',
      permissions: '*'
    }]
  }]);
};

/**
 * Check If Itineries Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an itinery is being processed and the current user created it then allow any manipulation
  if (req.itinery && req.user && req.itinery.user && req.itinery.user.id === req.user.id) {
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
