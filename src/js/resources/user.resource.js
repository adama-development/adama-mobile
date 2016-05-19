'use strict';

angular.module('adama-mobile').factory('User', function($resource, adamaConstant, adamaResourceConfig) {
	var config = angular.extend({}, adamaResourceConfig, {
		'delete': {
			method: 'DELETE',
			params: {
				id: '@id'
			}
		}
	});
	return $resource(adamaConstant.apiBase + 'users/:id', {}, config);
});
