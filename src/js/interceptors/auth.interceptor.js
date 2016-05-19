/*jshint -W069 */
/*jscs:disable requireDotNotation*/
'use strict';

angular.module('adama-mobile').factory('authInterceptor', function($injector, $q, adamaConstant) {
	var getAdamaTokenService = (function() {
		var service;
		return function() {
			return service || (service = $injector.get('adamaTokenService'));
		};
	}());

	var getStateService = (function() {
		var service;
		return function() {
			return service || (service = $injector.get('$state'));
		};
	}());

	return {
		// Add authorization token to headers
		request: function(config) {
			console.log('authInterceptor', config.url);
			config.headers = config.headers || {};
			if (!config.headers['Authorization'] && config.url.indexOf(adamaConstant.apiBase) === 0) {
				console.log('authInterceptor need authorization, getting token');
				return getAdamaTokenService().getToken().then(function(token) {
					console.log('authInterceptor adding Authorization header', token);
					if (token) {
						config.headers['Authorization'] = 'Bearer ' + token;
					}
					return config;
				}, function(rejection) {
					return getStateService().go('auth.signin').then(function() {
						console.log('authInterceptor error while getting user token', rejection);
						return $q.reject(rejection);
					});
				});
			}
			return config;
		}
	};
});
