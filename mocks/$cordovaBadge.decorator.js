'use strict';

angular.module('adama-mobile').decorator('$cordovaBadge', function($delegate) {
	console.log('decorating $delegate ...');
	$delegate.clear = function() {
		console.warn('decorated $cordovaBadge.clear');
	};
	return $delegate;
});
