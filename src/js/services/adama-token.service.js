'use strict';

angular.module('adama-mobile').factory('adamaTokenService', function($http, $q, $state, $ionicUser, jwtHelper, adamaConstant) {
	var api = {};

	api.getToken = function() {
		console.log('getToken');
		var token;
		var ionicUser = $ionicUser.current();
		if (ionicUser.isAuthenticated()){
			token = ionicUser.get('token');
			if (jwtHelper.isTokenExpired(token)) {
				return api.refreshAndGetToken();
			}
		}
		return $q.when(token);
	};

	api.refreshAndGetToken = function() {
		var user = $ionicUser.current();
		var token = user.get('token');
		var refreshToken = user.get('refreshToken');
		return $http({
			method : 'GET',
			url : adamaConstant.apiBase + 'api/refreshToken',
			headers : {
				'x-auth-token' : token,
				'x-auth-refresh-token' : refreshToken
			}
		}).then(function(response){
			var newToken = response.data;
			user.set('token', newToken);
			return user.save().then(function(){
				return newToken;
			});
		}, function(rejection){
			console.error('error while refreshing user token, redirect to signin', rejection);
			$state.go('auth.signin');
		});
	};

	return api;
});
