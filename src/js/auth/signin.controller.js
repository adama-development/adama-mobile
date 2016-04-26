'use strict';

angular.module('adama-mobile').controller('SigninCtrl', function($rootScope, $state, authService, $filter, $ionicPopup) {
	var ctrl = this;
	ctrl.signin = function(userName, userPassword) {
		authService.login(userName, userPassword).then(function() {
			$state.go('app.main');
		}).catch(function(rejection) {
			console.error('error while signing in', rejection);
			var translateFn = $filter('translate');
			$ionicPopup.alert({
				title: translateFn('SIGNIN_ERROR_TITLE'),
				template: translateFn('SIGNIN_ERROR_MESSAGE')
			});
		});
	};
});
