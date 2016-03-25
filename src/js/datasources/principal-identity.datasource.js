'use strict';

angular.module('adama-mobile').directive('dsPrincipalIdentity', function($parse, Principal) {
	return {
		scope: false,
		link: function(scope, element, attrs) {
			Principal.identity().then(function(account) {
				$parse(attrs.data).assign(scope, account);
			});
		}
	};
});
