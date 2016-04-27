/*jshint -W069 */
/*jscs:disable requireDotNotation*/
'use strict';

angular.module('adama-mobile').factory('authInterceptor', function($injector, adamaConstant) {
	var getAdamaTokenService = (function() {
		var service;
		return function() {
			return service || (service = $injector.get('adamaTokenService'));
		};
	}());

	return {
		// Add authorization token to headers
		request: function(config) {
			config.headers = config.headers || {};
			if (!config.headers['x-auth-token'] && config.url.indexOf(adamaConstant.apiBase) === 0) {
				return getAdamaTokenService().getToken().then(function(token) {
					if (token) {
						config.headers['Authorization'] = 'Bearer ' + token;
					}
					return config;
				});
			}
			return config;
		}
	};
});
