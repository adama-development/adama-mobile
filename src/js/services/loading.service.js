'use strict';

angular.module('adama-mobile').factory('loadingService', function($filter, $ionicLoading) {
	var api = {};
	var translateFn = $filter('translate');

	api.blockUiWhileResolving = function(messageKey, promise) {
		if (promise.$$state.status === 0) {
			$ionicLoading.show({
				template: translateFn(messageKey)
			});
		}
		return promise.finally(function() {
			$ionicLoading.hide();
		});
	};

	return api;
});
