'use strict';

angular.module('adamaDemoApp').config(function($stateProvider) {
	$stateProvider.state('app.main', {
		url : '/',
		views : {
			'main-content' : {
				templateUrl : 'modules/main/main.html',
				controller : 'MainCtrl',
				controllerAs : 'ctrl'
			}
		},
		data : {
			pageTitle : 'HOME'
		}
	});
});

angular.module('adamaDemoApp').config(function($translateProvider) {
	$translateProvider.translations('fr', {
		'HOME' : 'Accueil'
	});

	$translateProvider.translations('en', {
		'HOME' : 'Home'
	});
});
