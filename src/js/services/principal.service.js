/*jshint -W069 */
/*jscs:disable requireDotNotation*/
'use strict';

angular.module('adama-mobile').factory('principalService', function($rootScope, $q, $http, $resource, $state, $ionicUser, $log, adamaConstant) {
	var log = $log.getInstance('adama-mobile.services.principalService');
	var api = {};
	var principalPromise;
	var ionicUser = $ionicUser.current();
	var isAuthenticated = ionicUser.isAuthenticated();
	var accountResource = $resource(adamaConstant.apiBase + 'account', {}, {});
	var passwordResource = $resource(adamaConstant.apiBase + 'account/change_password', {}, {});
	var passwordResetInitResource = $resource(adamaConstant.apiBase + 'account/reset_password/init', {}, {});

	api.isAuthenticated = function() {
		return isAuthenticated;
	};

	api.resetPrincipal = function() {
		var result;
		ionicUser = $ionicUser.current();
		isAuthenticated = ionicUser.isAuthenticated();
		log.debug('resetPrincipal');
		log.debug('resetPrincipal ionicUser', ionicUser);
		log.debug('resetPrincipal isAuthenticated', isAuthenticated);
		if (isAuthenticated) {
			var externalId = ionicUser.details['external_id'];
			if (!externalId) {
				// FIXME should not occur, every ionicuser should have an
				// external_id
				log.info('no external_id, redirect to signin');
				result = $q.reject('resetPrincipal : no external_id');
			} else {
				principalPromise = $http({
					method: 'GET',
					url: adamaConstant.apiBase + 'users/byLogin/' + externalId
				}).then(function(response) {
					var principal = response.data;
					isAuthenticated = true;
					$rootScope.$broadcast('principal-new', {
						principal: principal
					});
					return principal;
				});
				result = principalPromise;
			}
		} else {
			log.info('user is not authenticated');
			result = $q.reject('resetPrincipal : not authenticated');
		}
		return result.catch(function(rejection) {
			log.debug('there was a problem while reseting user info, redirect to signin');
			isAuthenticated = false;
			principalPromise = undefined;
			$state.go('auth.signin');
			return $q.reject(rejection);
		});
	};

	api.getPrincipal = function() {
		if (!principalPromise) {
			return api.resetPrincipal();
		}
		return principalPromise;
	};

	api.deletePrincipal = function() {
		isAuthenticated = false;
		principalPromise = undefined;
		$rootScope.$broadcast('principal-remove');
	};

	api.hasAnyAuthority = function(authorities) {
		log.debug('hasAnyAuthority', authorities);
		// TODO
		return true;
	};

	api.resetPasswordInit = function(mail) {
		log.debug('resetPasswordInit', mail);
		return passwordResetInitResource.save({
			mail: mail,
			urlResetPassword: adamaConstant.urlResetPassword
		}).$promise;
	};

	api.updateAccount = function(principal) {
		log.debug('updateAccount', principal);
		return accountResource.save(principal, function() {
			$rootScope.$emit('principal-update', {
				principal: principal
			});
			principalPromise = $q.when(principal);
		}).$promise;
	};

	api.changePassword = function(newPassword) {
		log.debug('changePassword');
		return passwordResource.save({
			password: newPassword
		}).$promise;
	};

	return api;
});
