'use strict';

angular.module('adama-mobile').factory('errorHandlerInterceptor', function($q, $rootScope, jHipsterConstant) {
	return {
		'responseError': function(response) {
			if (!(response.status === 401 && response.data.path.indexOf('/api/account') === 0)) {
				$rootScope.$emit(jHipsterConstant.appModule + '.httpError', response);
			}
			return $q.reject(response);
		}
	};
});
