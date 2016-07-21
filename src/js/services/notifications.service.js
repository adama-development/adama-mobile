'use strict';

angular.module('adama-mobile').factory('notificationsService', function($filter, $cordovaToast) {
	var api = {};
	var translateFn = $filter('translate');

	api.show = function(messageKey) {
		console.log('notifications show', messageKey);
		return $cordovaToast.show(translateFn(messageKey), 'short', 'bottom');
	};

	return api;
});
