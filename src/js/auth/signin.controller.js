'use strict';

angular.module('adama-mobile').controller('SigninCtrl', function($rootScope, $state, Auth, $filter, $ionicPopup) {
	var ctrl = this;
	ctrl.signin = function(userName, userPassword) {
		Auth.login({
			username: userName,
			password: userPassword
		}).then(function() {
			$state.go('app.main');
		}).catch(function() {
			var translateFn = $filter('translate');
			$ionicPopup.alert({
				title: translateFn('SIGNIN_ERROR_TITLE'),
				template: translateFn('SIGNIN_ERROR_MESSAGE')
			});
		});
	};
});
