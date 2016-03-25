'use strict';

angular.module('adama-mobile').run(function($rootScope, $state, Principal, Auth) {
	$rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
		$rootScope.toState = toState;
		$rootScope.toStateParams = toStateParams;
		if (Principal.isIdentityResolved()) {
			Auth.authorize();
		}
	});

	$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
		// Remember previous state unless we've been redirected to login or
		// we've just reset the state memory after logout. If we're redirected
		// to login, our previousState is already set in the
		// authExpiredInterceptor. If we're going to login directly, we don't
		// want to be sent to some previous state anyway
		if (toState.name !== 'auth.signin' && $rootScope.previousStateName) {
			$rootScope.previousStateName = fromState.name;
			$rootScope.previousStateParams = fromParams;
		}
	});

	$rootScope.back = function() {
		// If previous state is 'activate' or do not exist go to 'home'
		if ($state.get($rootScope.previousStateName) === null) {
			$state.go('app.main');
		} else {
			$state.go($rootScope.previousStateName, $rootScope.previousStateParams);
		}
	};
});

angular.module('adama-mobile').config(function($httpProvider) {
	// $httpProvider.interceptors.push('errorHandlerInterceptor');
	$httpProvider.interceptors.push('authExpiredInterceptor');
	$httpProvider.interceptors.push('authInterceptor');
	// $httpProvider.interceptors.push('notificationInterceptor');
});
