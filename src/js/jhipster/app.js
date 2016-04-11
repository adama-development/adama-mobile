'use strict';

angular.module('adama-mobile').run(function($rootScope, $state, Principal, Auth) {
	$rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
		$rootScope.toState = toState;
		$rootScope.toStateParams = toStateParams;
		if (Principal.isIdentityResolved()) {
			Auth.authorize();
		}
	});
});

angular.module('adama-mobile').config(function($httpProvider) {
	// $httpProvider.interceptors.push('errorHandlerInterceptor');
	$httpProvider.interceptors.push('authExpiredInterceptor');
	$httpProvider.interceptors.push('authInterceptor');
	// $httpProvider.interceptors.push('notificationInterceptor');
});
