/* jscs:disable requireCamelCaseOrUpperCaseIdentifiers */
/* jshint camelcase:false */

'use strict';

angular.module('adama-mobile').factory('adamaTokenService', function($rootScope, $http, $q, $state, $ionicUser, $log, jwtHelper, adamaConstant) {
	var log = $log.getInstance('adama-mobile.services.adamaTokenService');
	var api = {};

	var ionicUser = $ionicUser.current();
	$rootScope.$on('ionicuser-new', function() {
		log.debug('update ionicUser');
		ionicUser = $ionicUser.current();
	});

	api.getToken = function() {
		log.debug('getToken');
		var token;
		if (ionicUser.isAuthenticated()) {
			log.debug('getToken user is authenticated');
			token = ionicUser.get('access_token');
			if (token && jwtHelper.isTokenExpired(token)) {
				log.debug('getToken token is expired');
				return api.refreshAndGetToken();
			}
		}
		return $q.when(token);
	};

	api.refreshAndGetToken = function() {
		log.debug('refreshAndGetToken');
		var token = ionicUser.get('access_token');
		if (!token) {
			// FIXME should not occur as ionicUser should always have a
			// access_token
			log.info('no token, redirect to signin');
			log.debug('for debugging purpose, here is the ionic current user', ionicUser);
			log.debug('for debugging purpose, here is the ionic current user.isAuthenticated', ionicUser.isAuthenticated());
			log.debug('for debugging purpose, here is a JSON.stringify version of ionic current user', JSON.stringify(ionicUser));
			return $q.reject('refreshAndGetToken : no token !!!!');
		}
		log.debug('refreshAndGetToken token', token);
		var refreshToken = ionicUser.get('refresh_token');
		log.debug('refreshAndGetToken refreshToken', refreshToken);
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
			log.debug('refreshAndGetToken newToken', newToken);
			ionicUser.set('access_token', newToken);
			return ionicUser.save().then(function() {
				return newToken;
			});
		}, function(rejection) {
			log.info('error while refreshing user token, redirect to signin', rejection);
			return $q.reject(rejection);
		});
	};

	return api;
});
