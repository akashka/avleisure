(function () {
    'use strict';

    // Focus the element on page load
    // Unless the user is on a small device, because this could obscure the page with a keyboard

    angular.module('core')
        .filter('Currency', Currency);

    function Currency() {
        return function (input) {
            if (!isNaN(input)) {
                var currencySymbol = '';
                //var output = Number(input).toLocaleString('en-IN');   <-- This method is not working fine in all browsers!           
                var result = input.toString().split('.');

                var lastThree = result[0].substring(result[0].length - 3);
                var otherNumbers = result[0].substring(0, result[0].length - 3);
                if (otherNumbers != '')
                    lastThree = ',' + lastThree;
                var output = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

                if (result.length > 1) {
                    output += "." + result[1];
                }

                return currencySymbol + output;
            }
        }
    }
}());
