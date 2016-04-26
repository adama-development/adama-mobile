'use strict';

angular.module('adama-mobile').factory('User', function($resource, adamaConstant, adamaResourceConfig) {
	var config = angular.extend({}, adamaResourceConfig, {
		'delete': {
			method: 'DELETE',
			params: {
				login: '@login'
			}
		}
	});
	return $resource(adamaConstant.apiBase + 'api/users/:login', {}, config);
});
