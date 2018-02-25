/* jscs:disable requireCamelCaseOrUpperCaseIdentifiers */
/* jshint camelcase:false */

'use strict';

angular.module('adama-mobile').factory('authService', function($rootScope, $http, localStorageService, $log, adamaConstant, principalService) {
	var log = $log.getInstance('adama-mobile.services.authService');
	var api = {};

	api.login = function(username, password) {
		log.debug('login', username);
		var data = {
			username: username,
			password: password
		};

		return $http({
			method: 'POST',
			url: adamaConstant.apiBase + 'login/authenticate',
			data: data
		}).then(function(response) {
			log.debug('User is authenticated');
			localStorageService.set('access_token', response.data.access_token);
			localStorageService.set('refresh_token', response.data.refresh_token);
			localStorageService.set('external_id', username);
		});
	};

	api.logout = function() {
		log.debug('logout');
		localStorageService.set('access_token', undefined);
		localStorageService.set('refresh_token', undefined);
		localStorageService.set('external_id', undefined);
		principalService.deletePrincipal();
	};

	return api;
});
