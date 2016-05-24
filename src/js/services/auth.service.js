'use strict';

angular.module('adama-mobile').factory('authService', function($rootScope, $http, $ionicAuth, adamaConstant, principalService) {
	var api = {};

	api.login = function(username, password) {
		console.log('login', username);
		var authOptions = {
			remember: true
		};
		var data = {
			username: username,
			password: password
		};
		return $ionicAuth.login('custom', authOptions, data).then(function() {
			console.log('login is ok, ask custom auth server to refresh the user data');
			return $http({
				method: 'POST',
				url: adamaConstant.apiBase + 'externalLogin/refreshUserExternal',
				data: {
					externalId: username
				}
			});
		}).then(function() {
			console.log('refreshing custom auth server is ok, ask the backend for the updated user info');
			$rootScope.$broadcast('ionicuser-new');
			// get the new user information from ionic
			return principalService.resetPrincipal();
		}).then(function() {
			console.log('user is logged in in both ionic and backend');
		});
	};

	api.logout = function() {
		console.log('logout');
		$ionicAuth.logout();
		principalService.deletePrincipal();
	};

	return api;
});
