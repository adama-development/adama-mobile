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

	return {
		responseError: function(response) {
			console.log('adamaTokenService.authExpiredInterceptor');
			var config = response.config;
			if (response.status === 401 && config.url.indexOf(adamaConstant.apiBase) === 0) {
				console.log('adamaTokenService.authExpiredInterceptor error 401, refresh token');
				return getAdamaTokenService().refreshAndGetToken().then(function() {
					console.log('adamaTokenService.authExpiredInterceptor token is refresh, reset Authorization header');
					config.headers['Authorization'] = undefined;
					return getHttpService()(config);
				});
			}
			return $q.reject(response);
		}
	};
});
