'use strict';

angular.module('adama-mobile').factory('User', function($resource, jHipsterConstant, jHipsterResourceConfig) {
	var config = angular.extend({}, jHipsterResourceConfig, {
		'delete': {
			method: 'DELETE',
			params: {
				login: '@login'
			}
		}
	});
	return $resource(jHipsterConstant.apiBase + 'api/users/:login', {}, config);
});
