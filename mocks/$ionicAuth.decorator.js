'use strict';

angular.module('adama-mobile').decorator('$ionicAuth', function($delegate, $q) {
	console.log('decorating $ionicAuth ...');

	$delegate.login = function(moduleId, options, data) {
		console.warn('decorated $ionicAuth.login', moduleId, options, data);
		return $q.when();
	};

	return $delegate;
});
