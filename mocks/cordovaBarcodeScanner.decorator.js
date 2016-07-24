'use strict';

angular.module('ngCordovaMocks').decorator('$cordovaBarcodeScanner', function($delegate, $window, $q) {
	console.log('decorating $cordovaBarcodeScanner ...');

	$delegate.scan = function() {
		console.log('$cordovaBarcodeScanner scan');
		var prompt = $window.prompt('Mocked scan? ("ko", "cancel" or what you want)');
		if (prompt === 'ko') {
			console.log('$cordovaBarcodeScanner scan : KO');
			return $q.reject('scan error');
		}
		if (prompt === 'cancel') {
			console.log('$cordovaBarcodeScanner scan : cancel');
			return $q.when({
				text : '',
				format : '',
				cancelled : true
			});
		}
		console.log('$cordovaBarcodeScanner scan : OK', prompt);
		return $q.when({
			text : prompt,
			format : '',
			cancelled : false
		});
	};

	return $delegate;
});
