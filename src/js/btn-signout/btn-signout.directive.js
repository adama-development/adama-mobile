'use strict';

angular.module('adama-mobile').component('btnSignout', {
	templateUrl: 'adama-mobile/btn-signout/btn-signout.html',
	controller: function(Auth, $state) {
		var ctrl = this;
		ctrl.signout = function() {
			Auth.logout();
			$state.go('auth.signin');
		};
	}
});
