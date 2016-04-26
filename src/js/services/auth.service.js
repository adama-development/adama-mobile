'use strict';

angular.module('adama-mobile').factory('authService', function($http, $ionicAuth, jHipsterConstant, principalService) {
	var api = {};

	api.login = function(username, password) {
		console.log('login', username);
		var authOptions = {
			remember : true
		};
		var data = {
			username : username,
			password : password
		};
		return $ionicAuth.login('custom', authOptions, data).then(function() {
			console.log('login is ok, ask custom auth server to refresh the user data');
			return $http({
				method : 'POST',
				url : jHipsterConstant.apiBase + 'externalLogin/refreshUserExternal',
				data : {
					externalId : username
				}
			});
		}).then(function() {
			console.log('refreshing custom auth server is ok, ask ionic for the updateduser info');
			// get the new user information from ionic
			return principalService.resetPrincipal();
		});
	};

	api.logout = function() {
		console.log('logout');
		$ionicAuth.logout();
		principalService.deletePrincipal();
	};

	return api;
});
