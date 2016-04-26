'use strict';

angular.module('adama-mobile').factory('authExpiredInterceptor', function($injector, $q, jHipsterConstant) {
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
		responseError : function(response) {
			var config = response.config;
			if (response.status === 401 && config.url.indexOf(jHipsterConstant.apiBase) === 0) {
				return getAdamaTokenService().refreshAndGetToken().then(function(){
					return getHttpService()(config);
				});
			}
			return $q.reject(response);
		}
	};
});
