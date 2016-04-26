'use strict';

angular.module('adama-mobile').run(function($httpBackend, $http) {
	$httpBackend.when('POST', '/externalLogin/refreshUserExternal').respond(function() {
		console.warn('POST /externalLogin/refreshUserExternal');
		// TODO
		return [ 200, {} ];
	});
});
