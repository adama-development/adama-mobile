'use strict';

angular.module('adama-mobile').decorator('$ionicAuth', function($delegate, $q) {
	console.log('decorating $ionicAuth ...');

	return $delegate;
});
