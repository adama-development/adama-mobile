'use strict';

angular.module('adama-mobile').run(function($httpBackend, $http) {
	$httpBackend.when('PUT', '/files').respond(function(method, url, data) {
		data = JSON.parse(data);
		console.warn('PUT /files', method, url, data);
		var result = {};
		angular.forEach(data.idList, function(id) {
			result[id] = id + '?comingFormMock=true';
		});
		return [ 200, result ];
	});
});
