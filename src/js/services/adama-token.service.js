/* jscs:disable requireCamelCaseOrUpperCaseIdentifiers */
/* jshint camelcase:false */

'use strict';

angular.module('adama-mobile').factory('adamaTokenService', function($rootScope, $http, $q, $state, $ionicUser, jwtHelper, adamaConstant) {
	var api = {};

	var ionicUser = $ionicUser.current();
	$rootScope.$on('ionicuser-new', function() {
		console.log('adamaTokenService update ionicUser');
		ionicUser = $ionicUser.current();
	});

	api.getToken = function() {
		console.log('adamaTokenService.getToken');
		var token;
		if (ionicUser.isAuthenticated()) {
			console.log('adamaTokenService.getToken user is authenticated');
			token = ionicUser.get('access_token');
			if (token && jwtHelper.isTokenExpired(token)) {
				console.log('adamaTokenService.getToken token is expired');
				return api.refreshAndGetToken();
			}
		}
		return $q.when(token);
	};

	api.refreshAndGetToken = function() {
		console.log('adamaTokenService.refreshAndGetToken');
		var token = ionicUser.get('access_token');
		if (!token) {
			// FIXME should not occur as ionicUser should always have a
			// access_token
			console.error('no token, redirect to signin');
			console.log('for debugging purpose, here is the ionic current user', ionicUser);
			console.log('for debugging purpose, here is the ionic current user.isAuthenticated', ionicUser.isAuthenticated());
			console.log('for debugging purpose, here is a JSON.stringify version of ionic current user', JSON.stringify(ionicUser));
			return $q.reject('refreshAndGetToken : no token !!!!');
		}
		console.log('adamaTokenService.refreshAndGetToken token', token);
		var refreshToken = ionicUser.get('refresh_token');
		console.log('adamaTokenService.refreshAndGetToken refreshToken', refreshToken);
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
			console.log('adamaTokenService.refreshAndGetToken newToken', newToken);
			ionicUser.set('access_token', newToken);
			return ionicUser.save().then(function() {
				return newToken;
			});
		}, function(rejection) {
			console.error('error while refreshing user token, redirect to signin', rejection);
			return $q.reject(rejection);
		});
	};

	return api;
});
