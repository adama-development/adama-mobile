/*jshint -W069 */
/*jscs:disable requireDotNotation*/
'use strict';

angular.module('adama-mobile').factory('principalService', function($rootScope, $q, $http, $resource, $ionicUser, adamaConstant) {
	var api = {};
	var principalPromise = $q.reject('not init');
	var isAuthenticated = false;
	var accountResource = $resource(adamaConstant.apiBase + 'account', {}, {});
	var passwordResource = $resource(adamaConstant.apiBase + 'account/change_password', {}, {});
	var passwordResetInitResource = $resource(adamaConstant.apiBase + 'account/reset_password/init', {}, {});

	api.resetPrincipal = function() {
		isAuthenticated = false;
		var ionicUser = $ionicUser.current();
		if (ionicUser.isAuthenticated()) {
			var externalId = ionicUser.details['external_id'];
			if (!externalId) {
				externalId = ionicUser['external_id'];
			}
			if (!externalId) {
				principalPromise = $q.reject('not logged');
			} else {
				var token = ionicUser.get('access_token');
				if (!token) {
					principalPromise = $http({
						method: 'GET',
						headers: {
							'Authorization': 'Bearer ' + token
						},
						url: adamaConstant.apiBase + 'users/byLogin/' + externalId
					}).then(function(response) {
						var principal = response.data;
						isAuthenticated = true;
						$rootScope.$broadcast('principal-new', {
							principal: principal
						});
						return principal;
					});
				} else {
					principalPromise = $q.reject('not logged');
				}
			}
		} else {
			principalPromise = $q.reject('not logged');
		}
		return principalPromise;
	};

	api.getPrincipal = function() {
		return principalPromise;
	};

	api.deletePrincipal = function() {
		isAuthenticated = false;
		principalPromise = $q.reject('not logged');
		$rootScope.$broadcast('principal-remove');
	};

	api.authorize = function() {
		console.log('authorize');
	};

	api.hasAnyAuthority = function(authorities) {
		console.log('hasAnyAuthority', authorities);
		// TODO
		return true;
	};

	api.resetPasswordInit = function(mail) {
		console.log('resetPasswordInit', mail);
		return passwordResetInitResource.save({
			mail: mail,
			urlResetPassword: adamaConstant.urlResetPassword
		}).$promise;
	};

	api.updateAccount = function(principal) {
		console.log('updateAccount', principal);
		return accountResource.save(principal, function() {
			$rootScope.$emit('principal-update', {
				principal: principal
			});
			principalPromise = $q.when(principal);
		}).$promise;
	};

	api.changePassword = function(newPassword) {
		console.log('changePassword');
		return passwordResource.save({
			password: newPassword
		}).$promise;
	};

	return api;
});
