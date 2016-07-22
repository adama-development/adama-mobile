'use strict';

angular.module('adama-mobile').factory('authService', function($rootScope, $http, $ionicAuth, $log, adamaConstant, principalService) {
	var log = $log.getInstance('adama-mobile.services.authService');
	var api = {};

	api.login = function(username, password) {
		log.debug('login', username);
		var authOptions = {
			remember: true
		};
		var data = {
			username: username,
			password: password
		};
		return $ionicAuth.login('custom', authOptions, data).then(function() {
			log.debug('login is ok, ask custom auth server to refresh the user data');
			return $http({
				method: 'POST',
				url: adamaConstant.apiBase + 'externalLogin/refreshUserExternal',
				data: {
					externalId: username
				}
			});
		}).then(function() {
			log.debug('refreshing custom auth server is ok, ask the backend for the updated user info');
			$rootScope.$broadcast('ionicuser-new');
			// get the new user information from ionic
			return principalService.resetPrincipal();
		}).then(function() {
			log.debug('user is logged in in both ionic and backend');
		});
	};

	api.logout = function() {
		log.debug('logout');
		$ionicAuth.logout();
		principalService.deletePrincipal();
	};

	return api;
});
