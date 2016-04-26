'use strict';

angular.module('adama-mobile').component('btnSignout', {
	templateUrl: 'adama-mobile/btn-signout/btn-signout.html',
	controller: function(authService, $state) {
		var ctrl = this;
		ctrl.signout = function() {
			authService.logout();
			$state.go('auth.signin');
		};
	}
});
