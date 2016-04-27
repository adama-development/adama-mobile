'use strict';

angular.module('adama-mobile').run(function($httpBackend, $http) {
	$httpBackend.when('PUT', '/files').respond(function(method, url, data) {
		data = JSON.parse(data);
		console.warn('PUT /files', method, url, data);
		var result = {
			urlList : {}
		};
		angular.forEach(data, function(id) {
			result.urlList[id] = id + '?comingFormMock=true';
		});
		return [ 200, result ];
	});
});
