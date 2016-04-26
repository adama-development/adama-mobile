'use strict';

angular.module('adama-mobile').decorator('$ionicPush', function($delegate) {
	console.log('decorating $ionicPush ...');

	$delegate.init = function(conf) {
		console.warn('decorated $ionicPush.init', conf);
	};

	$delegate.register = function() {
		console.warn('decorated $ionicPush.register');
	};

	$delegate.unregister = function() {
		console.warn('decorated $ionicPush.unregister');
	};

	return $delegate;
});
