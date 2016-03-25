'use strict';

angular.module('adama-mobile').directive('btnSignout', function() {
	return {
		templateUrl: 'adama-mobile/btn-signout/btn-signout.html',
		restrict: 'E',
		scope: {},
		bindToController: {},
		controller: function(Auth, $state) {
			var ctrl = this;
			ctrl.signout = function() {
				Auth.logout();
				$state.go('auth.signin');
			};
		},
		controllerAs: 'ctrl'
	};
});
