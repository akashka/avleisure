(function () {
  'use strict';

  angular
    .module('trips.services')
    .factory('TripsService', TripsService);

  TripsService.$inject = ['$resource', '$log', '$http'];

  function TripsService($resource, $log, $http) {
    var Trip = $resource('/api/trips', {}, {
      update: {
        method: 'PUT',
        url: '/api/trips',
        params: {
          provider: '@provider'
        }
      },
      saveTrip: {
        method: 'POST',
        url: '/api/trips'
      }
    });

    // Handle successful response
    function onSuccess(trip) {
      // Any required internal processing from inside the service, goes here.
    }

    // Handle error response
    function onError(errorResponse) {
      var error = errorResponse.data;
      // Handle error internally
      handleError(error);
    }

    angular.extend(Trip, {
      createOrUpdate: function (trip) {
        if (trip._id) {
          return $http.put('/api/trips/' + trip._id, trip);
        } else {
          return this.saveTrip(trip).$promise;
        }
      }
    });

    return Trip;

    function createOrUpdate(trip) {
      if (trip._id) {
        return trip.$update(onSuccess, onError);
      } else {
        return this.saveTrip(trip).$promise;
      }

      // Handle successful response
      function onSuccess(trip) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }
  }
}());