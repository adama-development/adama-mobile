'use strict';

angular.module('adama-mobile').controller('SigninCtrl', function($rootScope, $state, $log, authService, $filter, $ionicPopup) {
	var log = $log.getInstance('adama-mobile.auth.signin');
	var ctrl = this;
	ctrl.loading = false;
	ctrl.signin = function(userName, userPassword) {
		ctrl.loading = true;
		authService.login(userName, userPassword).then(function() {
			log.debug('user is logged, rediret to app.main');
			$state.go('app.main');
			ctrl.loading = false;
		}).catch(function(rejection) {
			log.info('error while signing in', rejection);
			ctrl.rejection = rejection;
			var translateFn = $filter('translate');
			$ionicPopup.alert({
				title: translateFn('SIGNIN_ERROR_TITLE'),
				template: translateFn('SIGNIN_ERROR_MESSAGE')
			});
			ctrl.loading = false;
		});
	};
});
