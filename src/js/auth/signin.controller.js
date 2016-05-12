'use strict';

angular.module('adama-mobile').controller('SigninCtrl', function($rootScope, $state, authService, $filter, $ionicPopup) {
	var ctrl = this;
	ctrl.loading = false;
	ctrl.signin = function(userName, userPassword) {
		ctrl.loading = true;
		authService.login(userName, userPassword).then(function() {
			console.log('user is logged in in both ionic and backend, rediret to app.main');
			$state.go('app.main');
		}).catch(function(rejection) {
			ctrl.rejection = rejection;
			console.error('error while signing in', rejection);
			var translateFn = $filter('translate');
			$ionicPopup.alert({
				title: translateFn('SIGNIN_ERROR_TITLE'),
				template: translateFn('SIGNIN_ERROR_MESSAGE')
			});
		}).finally(function() {
			ctrl.loading = false;
		});
	};
});
