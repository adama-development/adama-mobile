'use strict';

angular.module('adama-mobile').factory('authInterceptor', function($injector, jHipsterConstant) {
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
			if (!config.headers['x-auth-token'] && config.url.indexOf(jHipsterConstant.apiBase) === 0){
				return getAdamaTokenService().getToken().then(function(token){
					if (token) {
						config.headers['x-auth-token'] = token;
					}
					return config;
				});
			}
			return config;
		}
	};
});
