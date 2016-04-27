'use strict';

angular.module('adama-mobile').factory('adamaTokenService', function($rootScope, $http, $q, $state, $ionicUser, jwtHelper, adamaConstant) {
	var api = {};

	var ionicUser = $ionicUser.current();
	$rootScope.$on('principal-new', function() {
		ionicUser = $ionicUser.current();
	});

	api.getToken = function() {
		console.log('getToken');
		var token;
		if (ionicUser.isAuthenticated()) {
			token = ionicUser.get('access_token');
			if (jwtHelper.isTokenExpired(token)) {
				return api.refreshAndGetToken();
			}
		}
		return $q.when(token);
	};

	api.refreshAndGetToken = function() {
		var token = ionicUser.get('access_token');
		var refreshToken = ionicUser.get('refresh_token');
		if (!token) {
			console.error('no token, redirect to signin');
			$state.go('auth.signin');
			return $q.reject('no token');
		}
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
			var newToken = response.data;
			ionicUser.set('access_token', newToken);
			return ionicUser.save().then(function() {
				return newToken;
			});
		}, function(rejection) {
			console.error('error while refreshing user token, redirect to signin', rejection);
			$state.go('auth.signin');
			return $q.reject(rejection);
		});
	};

	return api;
});
