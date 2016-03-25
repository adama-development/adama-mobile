'use strict';

angular.module('adama-mobile').config(function($translateProvider) {
	$translateProvider.translations('fr', {
		'BTN_SIGNOUT': 'Déconnexion'
	});

	$translateProvider.translations('en', {
		'BTN_SIGNOUT': 'Sign out'
	});
});
