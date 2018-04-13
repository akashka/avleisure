(function () {
  'use strict';

  angular
    .module('itineries.services')
    .factory('ItineriesService', ItineriesService);

  ItineriesService.$inject = ['$resource', '$log'];

  function ItineriesService($resource, $log) {
    var Itinery = $resource('/api/itineries/:itineryId', {
      itineryId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Itinery.prototype, {
      createOrUpdate: function () {
        var itinery = this;
        return createOrUpdate(itinery);
      }
    });

    return Itinery;

    function createOrUpdate(itinery) {
      if (itinery._id) {
        return itinery.$update(onSuccess, onError);
      } else {
        return itinery.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(itinery) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());
