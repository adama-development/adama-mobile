/* globals StatusBar:false, cordova: false */

'use strict';

angular.module('adama-mobile').run(function($ionicPlatform) {
	$ionicPlatform.ready(function() {
		if (window.cordova && window.cordova.plugins.Keyboard) {
			// Hide the accessory bar by default (remove this to show the
			// accessory bar above the keyboard for form inputs)
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

			// Don't remove this line unless you know what you are doing. It
			// stops the viewport from snapping when text inputs are focused.
			// Ionic handles this internally for a much nicer keyboard
			// experience.
			cordova.plugins.Keyboard.disableScroll(true);
		}
		if (window.StatusBar) {
			StatusBar.styleDefault();
		}
	});
});

angular.module('adama-mobile').config(function($urlRouterProvider) {
	// see https://github.com/angular-ui/ui-router/issues/600#issuecomment-47228922
	$urlRouterProvider.otherwise(function($injector) {
		var $state = $injector.get('$state');
		$state.go('app.main');
	});
});

angular.module('adama-mobile').config(function($translateProvider) {
	$translateProvider.useSanitizeValueStrategy('escapeParameters');

	$translateProvider.useLocalStorage();

	$translateProvider.registerAvailableLanguageKeys(['en', 'fr'], {
		'en_*': 'en',
		'fr_*': 'fr'
	});

	$translateProvider.determinePreferredLanguage().fallbackLanguage('en');
});

angular.module('adama-mobile').config(function($stateProvider, adamaConstant) {
	$stateProvider.state('app', {
		abstract: true,
		url: '/app',
		templateUrl: function() {
			return adamaConstant.adamaMobileToolkitTemplateUrl.app;
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

angular.module('adama-mobile').config(function($httpProvider) {
	$httpProvider.interceptors.push('authExpiredInterceptor');
	$httpProvider.interceptors.push('authInterceptor');
});

angular.module('adama-mobile').run(function($rootScope, $state, principalService) {
	$rootScope.$on('$stateChangeStart', function(event, toState) {
		if (toState.data && toState.data.authorities && toState.data.authorities.length > 0) {
			// state needs at least one authority
			if (!principalService.isAuthenticated()) {
				// send user to the signin state so user can log in
				$state.go('auth.signin');
			} else {
				if (!principalService.hasAnyAuthority(toState.data.authorities)) {
					// user is signed in but not authorized for desired state
					$state.go('auth.accessDenied');
				}
			}
		}
	});
});

angular.module('adama-mobile').run(function($rootScope) {
	$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
		throw error;
	});
});

angular.module('adama-mobile').run(function($rootScope, $injector, adamaConstant) {
	var $ionicPlatform, $cordovaBadge;
	if (adamaConstant.enableBadge) {
		$ionicPlatform = $injector.get('$ionicPlatform');
		$cordovaBadge = $injector.get('$cordovaBadge');
		$ionicPlatform.on('resume', function() {
			$cordovaBadge.clear();
		});

		$ionicPlatform.ready(function() {
			$cordovaBadge.clear();
		});
	}
});

angular.module('adama-mobile').config(function(logEnhancerProvider) {
	logEnhancerProvider.prefixPattern = '%s::[%s]>';
	logEnhancerProvider.datetimePattern = 'DD/MM/YYYY HH:mm:ss';
	logEnhancerProvider.logLevels = {
		'*': logEnhancerProvider.LEVEL.OFF
	};
});
