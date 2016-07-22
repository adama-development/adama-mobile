'use strict';

angular.module('adama-mobile').factory('notificationsService', function($filter, $cordovaToast, $log) {
	var log = $log.getInstance('adama-mobile.services.notificationsService');
	var api = {};
	var translateFn = $filter('translate');

	api.show = function(messageKey) {
		log.debug('show', messageKey);
		return $cordovaToast.show(translateFn(messageKey), 'short', 'bottom');
	};

	return api;
});
