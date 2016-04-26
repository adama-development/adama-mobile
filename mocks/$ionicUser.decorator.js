'use strict';

angular.module('adama-mobile').decorator('$ionicUser', function($delegate, $q) {
	console.log('decorating $ionicUser ...');

	$delegate.current = function() {
		return $q.when({
			'external_id': 'loginFromAdamaApi'
		});
	};

	return $delegate;
});
