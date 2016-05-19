/*jshint -W069 */
/*jscs:disable requireDotNotation*/
'use strict';

angular.module('adama-mobile').factory('authExpiredInterceptor', function($injector, $q, adamaConstant) {
	var getHttpService = (function() {
		var service;
		return function() {
			return service || (service = $injector.get('$http'));
		};
	}());

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
		responseError: function(response) {
			var config = response.config;
			if (response.status === 401 && config.url.indexOf(adamaConstant.apiBase) === 0) {
				console.log('authExpiredInterceptor error 401, refresh token', config.url);
				return getAdamaTokenService().refreshAndGetToken().then(function() {
					console.log('authExpiredInterceptor token is refresh, reset Authorization header');
					config.headers['Authorization'] = undefined;
					return getHttpService()(config);
				}, function(rejection) {
					return getStateService().go('auth.signin').then(function() {
						console.log('authExpiredInterceptor error while getting user token', rejection);
						return $q.reject(rejection);
					});
				});
			}
			return $q.reject(response);
		}
	};
});
