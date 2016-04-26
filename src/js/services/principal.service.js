'use strict';

angular.module('adama-mobile').factory('principalService', function($rootScope, $q, $http, $resource, jHipsterConstant) {
	var api = {};
	var principalPromise = $q.reject('not init');
	var isAuthenticated = false;
	var accountResource = $resource(jHipsterConstant.apiBase + 'api/account', {}, {});
	var passwordResource = $resource(jHipsterConstant.apiBase + 'api/account/change_password', {}, {});
	var passwordResetInitResource = $resource(jHipsterConstant.apiBase + 'api/account/reset_password/init', {}, {});

	api.resetPrincipal = function() {
		isAuthenticated = false;
		var ionicUser = $ionicUser.current();
		if (ionicUser.isAuthenticated()) {
			return principalPromise = $http({
				method : 'GET',
				url : jHipsterConstant.apiBase + 'users/byLogin/' + ionicUser['external_id']
			}).then(function(response) {
				var principal = response.data;
				isAuthenticated = true;
				$rootScope.$broadcast('principal-new', {
					principal : principal
				});
				return principal;
			});
		}
		principalPromise = $q.reject('not logged');
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
		return passwordResetInitResource.save(mail).$promise;
	};

	api.updateAccount = function(principal) {
		console.log('updateAccount', principal);
		return accountResource.save(principal, function() {
			$rootScope.$emit('principal-update', {
				principal : principal
			});
			principalPromise = $q.when(principal);
		}).$promise;
	};

	api.changePassword = function(newPassword) {
		console.log('changePassword');
		return passwordResource.save(newPassword).$promise;
	};

	return api;
});
