'use strict';

angular.module('adama-mobile').factory('jHipsterResourceConfig', function(ParseLinks) {
	return {
		'query' : {
			method : 'GET',
			isArray : true,
			transformResponse : function(data, headers, status) {
				data = angular.fromJson(data);
				if (status === 200) {
					data.$metadata = {
						links : ParseLinks.parse(headers('link')),
						totalItems : headers('X-Total-Count')
					};
				}
				return data;
			},
			interceptor : {
				response : function(response) {
					response.resource.$metadata = response.data.$metadata;
					return response.resource;
				}
			}
		},
		'get' : {
			method : 'GET'
		},
		'save' : {
			method : 'POST'
		},
		'update' : {
			method : 'PUT'
		},
		'delete' : {
			method : 'DELETE',
			params : {
				id : '@id'
			}
		}
	};
});
