'use strict';

angular.module('adama-mobile').config(function($provide, mockSettings) {
	$provide.decorator('$httpBackend', function($delegate) {
		var proxy = function(method, url, data, callback, headers) {
			var interceptor = function() {
				var _this = this, _arguments = arguments;
				setTimeout(function() {
					callback.apply(_this, _arguments);
				}, mockSettings.defaultLatencyInMs);
			};
			return $delegate.call(this, method, url, data, interceptor, headers);
		};
		for ( var key in $delegate) {
			proxy[key] = $delegate[key];
		}
		return proxy;
	});
});
