/*jshint -W069 */
/*jscs:disable requireDotNotation*/
'use strict';

angular.module('adama-mobile').factory('principalService', function($rootScope, $q, $http, $resource, $state, $ionicUser, adamaConstant) {
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
		if (isAuthenticated) {
			var externalId = ionicUser.details['external_id'];
			if (!externalId) {
				// FIXME should not occur, every ionicuser should have an
				// external_id
				console.error('error while reseting principal, no external_id, redirect to signin');
				result = $q.reject('resetPrincipal : no external_id');
			} else {
				principalPromise = $http({
					method: 'GET',
					url: adamaConstant.apiBase + 'api/users/byLogin/' + externalId
				}).then(function(response) {
					var principal = response.data;
					isAuthenticated = true;
					ionicUser = $ionicUser.current();
					$rootScope.$broadcast('principal-new', {
						principal: principal
					});
					return principal;
				});
				result = principalPromise;
			}
			// if (!externalId) {
			// // FIXME external_id should be in details, not directly into
			// ionicUser
			// externalId = ionicUser['external_id'];
			// }
			// if (!externalId) {
			// // FIXME should not occur, every ionicuser should have an
			// external_id
			// principalPromise = $q.reject('not logged');
			// } else {
			// var token = ionicUser.get('access_token');
			// if (!token) {
			// principalPromise = $http({
			// method: 'GET',
			// headers: {
			// 'Authorization': 'Bearer ' + token
			// },
			// url: adamaConstant.apiBase + 'users/byLogin/' + externalId
			// }).then(function(response) {
			// var principal = response.data;
			// isAuthenticated = true;
			// $rootScope.$broadcast('principal-new', {
			// principal: principal
			// });
			// return principal;
			// });
			// } else {
			// principalPromise = $q.reject('not logged');
			// }
			// }
		} else {
			console.error('error while reseting principal, not authenticated, redirect to signin');
			result = $q.reject('resetPrincipal : not authenticated');
		}
		return result.catch(function(rejection) {
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
