'use strict';

angular.module('adama-mobile').factory('notificationInterceptor', function($q, AlertService, jHipsterConstant) {
	return {
		response: function(response) {
			var alertKey = response.headers('X-' + jHipsterConstant.appModule + '-alert');
			if (angular.isString(alertKey)) {
				AlertService.success(alertKey, {
					param: response.headers('X-' + jHipsterConstant.appModule + '-params')
				});
			}
			return response;
		}
	};
});
