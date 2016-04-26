'use strict';

angular.module('adama-mobile').directive('dsPrincipalIdentity', function($parse, principalService) {
	return {
		scope: false,
		link: function(scope, element, attrs) {
			principalService.getPrincipal().then(function(account) {
				$parse(attrs.data).assign(scope, account);
			});
		}
	};
});
