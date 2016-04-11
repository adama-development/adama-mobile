'use strict';

angular.module('adama-mobile').controller('RecoverPasswordCtrl', function($filter, $ionicPopup, Auth) {
	var ctrl = this;
	ctrl.recover = function(userEmail) {
		ctrl.recoverSuccess = false;
		ctrl.recoverError = false;
		ctrl.errorEmailNotExists = false;
		ctrl.loading = true;
		Auth.resetPasswordInit(userEmail).then(function() {
			ctrl.recoverSuccess = true;
		}).catch(function(response) {
			var messageKey = 'RECOVER_ERROR_GENERIC';
			if (response.status === 400 && response.data === 'e-mail address not registered') {
				messageKey = 'RECOVER_ERROR_EMAIL_NOT_EXIST';
			}
			var translateFn = $filter('translate');
			$ionicPopup.alert({
				title: translateFn('RECOVER_ERROR_TITLE'),
				template: translateFn(messageKey)
			});
		}).finally(function() {
			ctrl.loading = false;
		});
	};
});
