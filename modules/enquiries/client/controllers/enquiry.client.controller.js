(function () {
	'use strict';
	angular.module('enquiries').controller('EnquiriesAdminController', EnquiriesAdminController);
	EnquiriesAdminController.$inject = ['$scope', '$state', '$window', 'enquiryResolve', 'Authentication', 'Notification', 'EnquiriesService', 'ItineriesService', '$timeout', 'AdminService', '$http'];

	function EnquiriesAdminController($scope, $state, $window, enquiry, Authentication, Notification, EnquiriesService, ItineriesService, $timeout, AdminService, $http) {
		var vm = this;
		vm.enquiry = {
			enquiry_id: "",
			school_name: "",
			school_address: "",
			school_gprs: "",
			school_photo: "",
			school_email_id: "",
			alternate_email_id: "",
			school_phone_no: "",
			alternate_phone_no: "",
			school_contact_person: "",
			enquiry_by: [],
			followups: [],
			enquiries: [{
				itineries: '',
				plan: '',
				school_contact_person: '',
				school_class: '',
				transport: [],
				food: [],
				sharing: [],
				accomodation: [],
				package_type: '',
				quotations: [],
				extras: [],
				entry: [],
				remarks: '',
				no_of_students: 0,
				no_of_teachers: 0
			}]
		};
		vm.allEnquiries = EnquiriesService.query();
		vm.itineries = ItineriesService.query();
		vm.users = AdminService.query();
		vm.authentication = Authentication;
		vm.form = {};
		vm.remove = remove;
		vm.save = save;
		vm.rmEnquiry = rmEnquiry;
		vm.add = add;

		vm.transportOptions = ["A/C bus", "Non A/C bus", "A/C train", "Non A/C train", "Flight"];
		vm.foodOptions = ["Self catering", "Hotel"];
		vm.accomodationOptions = ["A/C", "Non A/C", "Dormitory"];
		vm.sharingOptions = ["Not Applicable", "Twin", "Tripple", "Quadruple"];
		vm.packageOptions = ["Resort Package", "Day Return Package", "Outstation", "International"];
		vm.multiselectSettings = { template: '{{option}}', smartButtonTextConverter(skip, option) { return option; }, smartButtonMaxItems: 4, checkBoxes: true };
		// vm.usermultiselectSettings = { template: '{{option.displayName}}', smartButtonTextConverter(skip, option) { return option; },  smartButtonMaxItems: 3 };
		vm.usermultiselectSettings = { displayProp: 'displayName', idProp: '_id', externalIdProp: '_id', smartButtonMaxItems: 3, checkBoxes: true };

		$timeout(function () {
			if ($state.params.enquiryId) {
				var allEnquiries = (vm.allEnquiries);
				for (var i = 0; i < allEnquiries.length; i++) {
					if (allEnquiries[i]._id == $state.params.enquiryId) {
						vm.enquiry = allEnquiries[i];
					}
				}
				var enqby = vm.enquiry.enquiry_by;
				vm.enquiry.enquiry_by = [];
				for (var k = 0; k < enqby.length; k++) {
					for (var v = 0; v < vm.users.length; v++) {
						if (vm.users[v].username == enqby[k].username)
							vm.enquiry.enquiry_by.push(vm.users[v]);
					}
				}
			} else {
				vm.enquiry.enquiry_by = [];
				for (var v = 0; v < vm.users.length; v++) {
					if (vm.users[v].username == vm.authentication.user.username)
						vm.enquiry.enquiry_by.push(vm.users[v]);
				}

				if (navigator.geolocation) {
					navigator.geolocation.watchPosition(showPosition);
				}
			}
			// vm.enquiry.enquiry_by.push(vm.authentication.user);
		}, 1000);

		function showPosition(position) {
			vm.enquiry.school_gprs = position.coords.latitude + "," + position.coords.longitude;
			console.log(vm.enquiry.school_gprs);
		}

		// Remove existing enquiry
		function remove() {
			if ($window.confirm('Are you sure you want to delete?')) {
				vm.enquiry.$remove(function () {
					$state.go('enquiries.list');
					Notification.success({
						message: '<i class="glyphicon glyphicon-ok"></i> Enquiry deleted successfully!'
					});
				});
			}
		}

		$scope.message = '';
		var getErrorInForm = function () {
			var flag = false;
			for (var e = 0; e < vm.enquiry.enquiries.length; e++) {
				if (vm.enquiry.enquiries[e].itineries == '') {
					$scope.message += 'Please select valid Itinery. ';
					flag = true;
				}
				if (vm.enquiry.enquiries[e].plan == '') {
					$scope.message += 'Please select valid Plan. ';
					flag = true;
				}
				if (vm.enquiry.enquiries[e].transport.length <= 0) {
					$scope.message += 'Please select valid Transport. ';
					flag = true;
				}
				if (vm.enquiry.enquiries[e].food.length <= 0) {
					$scope.message += 'Please select valid Food. ';
					flag = true;
				}
				if (vm.enquiry.enquiries[e].accomodation.length <= 0) {
					$scope.message += 'Please select valid Accomodation. ';
					flag = true;
				}
				if (vm.enquiry.enquiries[e].sharing.length <= 0) {
					$scope.message += 'Please select valid Sharing. ';
					flag = true;
				}
				if (vm.enquiry.enquiries[e].package_type.length == 0) {
					$scope.message += 'Please select valid Package Type. ';
					flag = true;
				}
			}
			return flag;
		}

		// Save Enquiry
		function save() {
			$scope.message = '';
			if (!vm.form.enquiryForm.$valid) {
				$scope.$broadcast('show-errors-check-validity', 'vm.form.enquiryForm');
				return false;
			} else if (vm.enquiry.enquiry_by.length <= 0) {
				$scope.message = 'Please select your name in Enquiry By!!!';
				return false;
			} else if (getErrorInForm()) {
				// $scope.message = '';
				return false;
			} else {
				// Create a new enquiry, or update the current instance
				if (vm.enquiry.enquiry_id == "") vm.enquiry.enquiry_id = ("ENQ" + vm.allEnquiries.length);
				EnquiriesService.createOrUpdate(vm.enquiry).then(successCallback).catch(errorCallback);

				function successCallback(res) {
					$http.post("/api/enquiriesSendEmailSms", vm.enquiry)
						.then(function (response) { });
					$state.go('enquiries.list'); // should we send the User to the list or the updated enquiries view?
					Notification.success({
						message: '<i class="glyphicon glyphicon-ok"></i> Enquiry saved successfully!'
					});
				}

				function errorCallback(res) {
					Notification.error({
						message: res.data.message,
						title: '<i class="glyphicon glyphicon-remove"></i> Enquiries save error!'
					});
				}
			}
		}

		// add new enquiries in enquiryForm
		function add() {
			vm.enquiry.enquiries.push(
				{
					itineries: '',
					plan: '',
					school_contact_person: '',
					school_class: '',
					transport: [],
					food: [],
					sharing: [],
					package_type: [],
					accomodation: [],
					quotations: [],
					extras: [],
					entry: [],
					remarks: '',
					no_of_students: 0,
					no_of_teachers: 0
				}
			);
		}

		// delete last enquiries in enquiryForm
		function rmEnquiry() {
			vm.enquiry.enquiries.pop();
		}

		vm.openMap = function (latlong) {
			var url = 'http://maps.google.com/maps?q=loc:' + latlong;
			window.open(url, '_blank');
		}

	}
}());
