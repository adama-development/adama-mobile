/*jshint -W069 */
/*jscs:disable requireDotNotation*/
'use strict';

angular.module('adama-mobile').factory('authInterceptor', function($injector, $q, $log, adamaConstant) {
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
			var log = $log.getInstance('adama-mobile.interceptors.authInterceptor');
			log.debug('url', config.url);
			config.headers = config.headers || {};
			if (!config.headers['Authorization'] && config.url.indexOf(adamaConstant.apiBase) === 0) {
				log.debug('need authorization, getting token');
				return getAdamaTokenService().getToken().then(function(token) {
					log.debug('adding Authorization header', token);
					if (token) {
						config.headers['Authorization'] = 'Bearer ' + token;
					}
					return config;
				}, function(rejection) {
					return getStateService().go('auth.signin').then(function() {
						log.debug('error while getting user token', rejection);
						return $q.reject(rejection);
					});
				});
			}
			return config;
		}
	};
});
