/* globals StatusBar:false, cordova: false */

'use strict';

angular.module('adama-mobile', [ //
'ionic',//
'pascalprecht.translate', //
'ngCookies', //
'ngResource', //
'LocalStorageModule', //
'ngMessages' //
]);

angular.module('adama-mobile').run(function($ionicPlatform) {
	$ionicPlatform.ready(function() {
		if (window.cordova && window.cordova.plugins.Keyboard) {
			// Hide the accessory bar by default (remove this to show the
			// accessory bar above the keyboard
			// for form inputs)
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

			// Don't remove this line unless you know what you are doing. It
			// stops the viewport
			// from snapping when text inputs are focused. Ionic handles this
			// internally for
			// a much nicer keyboard experience.
			cordova.plugins.Keyboard.disableScroll(true);
		}
		if (window.StatusBar) {
			StatusBar.styleDefault();
		}
	});
});

angular.module('adama-mobile').config(function($urlRouterProvider) {
	$urlRouterProvider.otherwise('/app/');
});

angular.module('adama-mobile').config(function($translateProvider) {
	$translateProvider.useSanitizeValueStrategy('escapeParameters');

	$translateProvider.useLocalStorage();

	$translateProvider.registerAvailableLanguageKeys([ 'en', 'fr' ], {
		'en_*' : 'en',
		'fr_*' : 'fr'
	});

	$translateProvider.determinePreferredLanguage().fallbackLanguage('en');
});

angular.module('adama-mobile').config(function($stateProvider, jHipsterConstant) {
	$stateProvider.state('app', {
		abstract : true,
		url : '/app',
		templateUrl : function() {
			return jHipsterConstant.adamaMobileToolkitTemplateUrl.app;
		},
		resolve : {
			authorize : function(Auth) {
				return Auth.authorize();
			}
		}
	});
});

angular.module('adama-mobile').run(function($rootScope, pageTitle) {
	$rootScope.$on('$stateChangeSuccess', function(event, toState) {
		if (toState && toState.data && toState.data.pageTitle) {
			pageTitle.set(toState.data.pageTitle);
		}
	});
});

angular.module('adama-mobile').run(function($rootScope) {
	$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
		throw error;
	});
});
