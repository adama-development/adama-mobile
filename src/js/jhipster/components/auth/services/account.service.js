'use strict';

angular.module('adama-mobile')
	.factory('Account', function Account($resource, jHipsterConstant) {
		return $resource(jHipsterConstant.apiBase + 'api/account', {}, {
			'get': {
				method: 'GET',
				params: {},
				isArray: false,
				interceptor: {
					response: function(response) {
						// expose response
						return response;
					}
				}
			}
		});
	});
