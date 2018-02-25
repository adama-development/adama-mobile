/* jscs:disable requireCamelCaseOrUpperCaseIdentifiers */
/* jshint camelcase:false */

'use strict';

angular.module('adama-mobile').factory('adamaTokenService', function($rootScope, $http, $q, $state, localStorageService, $log, jwtHelper, adamaConstant) {
	var log = $log.getInstance('adama-mobile.services.adamaTokenService');
	var api = {};

	api.getToken = function() {
		log.debug('getToken');
		var token = localStorageService.get('access_token');
		if (token) {
			log.debug('adamaTokenService.getToken user is authenticated');
			if (token && jwtHelper.isTokenExpired(token)) {
				log.debug('adamaTokenService.getToken token is expired');
				return api.refreshAndGetToken();
			}
		}
		return $q.when(token);
	};

	api.refreshAndGetToken = function() {
		log.debug('adamaTokenService.refreshAndGetToken');
		var token = localStorageService.get('access_token');
		if (!token) {
			log.info('no token, redirect to signin');
			return $q.reject('refreshAndGetToken : no token !!!!');
		}
		log.debug('adamaTokenService.refreshAndGetToken token', token);
		var refreshToken = localStorageService.get('refresh_token');
		log.debug('adamaTokenService.refreshAndGetToken refreshToken', refreshToken);
		return $http({
			method: 'POST',
			url: adamaConstant.apiBase + 'login/refresh',
			headers: {
				'Authorization': 'Bearer ' + token
			},
			data: {
				'refresh_token': refreshToken
			}
		}).then(function(response) {
			var newToken = response.data.access_token;
			log.debug('adamaTokenService.refreshAndGetToken newToken', newToken);
			localStorageService.set('access_token', newToken);
			return newToken;
		}, function(rejection) {
			log.info('error while refreshing user token, redirect to signin', rejection);
			return $q.reject(rejection);
		});
	};

	return api;
});
