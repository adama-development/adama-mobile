'use strict';

angular.module('adama-mobile').directive('dsPrincipalIdentity', function($rootScope, $parse, principalService) {
	return {
		scope: false,
		link: function(scope, element, attrs) {
			$rootScope.$on('principal-new', function(event, data) {
				$parse(attrs.data).assign(scope, data.principal);
			});
			$rootScope.$on('principal-remove', function() {
				$parse(attrs.data).assign(scope, undefined);
			});
			principalService.getPrincipal().then(function(principal) {
				$parse(attrs.data).assign(scope, principal);
			});
		}
	};
});
