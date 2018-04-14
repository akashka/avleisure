(function () {
  'use strict';

  angular
    .module('enquiries.services')
    .factory('EnquiriesService', EnquiriesService);

  EnquiriesService.$inject = ['$resource', '$log', '$http'];

  function EnquiriesService($resource, $log, $http) {
    var Enquiry = $resource('/api/enquiries', {}, {
      update: {
        method: 'PUT',
        url: '/api/enquiries',
        params: {
          provider: '@provider'
        }
      },
      saveEnquiry: {
        method: 'POST',
        url: '/api/enquiries'
      }
    });

    // Handle successful response
    function onSuccess(enquiry) {
      // Any required internal processing from inside the service, goes here.
    }

    // Handle error response
    function onError(errorResponse) {
      var error = errorResponse.data;
      // Handle error internally
      handleError(error);
    }

    angular.extend(Enquiry, {
      createOrUpdate: function (enquiry) {
        if (enquiry._id) {
          return $http.put('/api/enquiries/' + enquiry._id, enquiry);
        } else {
          return this.saveEnquiry(enquiry).$promise;
        }
      }
    });

    return Enquiry;

    function createOrUpdate(enquiry) {
      if (enquiry._id) {
        return this.update(enquiry).$promise;
      } else {
        return this.saveEnquiry(enquiry).$promise;
      }

      // Handle successful response
      function onSuccess(enquiry) {
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