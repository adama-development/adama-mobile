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

angular.module('adama-mobile').config(function($stateProvider, adamaConstant) {
	$stateProvider.state('app', {
		abstract : true,
		url : '/app',
		templateUrl : function() {
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
	if (adamaConstant.enableBadge){
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

angular.module('adama-mobile').run(function($rootScope, $injector, adamaConstant) {
	var $ionicPlatform, $ionicPush, $ionicUser;
	if (adamaConstant.enablePush){
		$ionicPlatform = $injector.get('$ionicPlatform');
		$ionicPush = $injector.get('$ionicPush');
		$ionicUser = $injector.get('$ionicUser');
		$ionicPlatform.ready(function() {
			$ionicPush.init({
				debug : false,
				onNotification : function(notification) {
					$rootScope.$apply(function(){
						// TODO notification management
						var payload = $ionicPush.getPayload(notification);
						console.log('notification, payload', notification, payload);
						$rootScope.notification = notification;
						$rootScope.payload = payload;
						if (notification.app.asleep || notification.app.closed) {
							// $state.go('tab.push');
							console.log('application was asleep or closed');
						}
					});
				},
				onRegister : function(data) {
					console.log('Device token', data.token);
				},
				canShowAlert: false,
				canSetBadge: true,
				canPlaySound: true,
				canRunActionsOnWake: true
			});
			if ($ionicUser.current().isAuthenticated()){
				$ionicPush.register(function(data) {
					console.log('register at startup ok', data);
				});
			} else {
				$ionicPush.unregister();
			}
		});
		$rootScope.on('principal-new', function(){
			$ionicPush.register(function(data) {
				console.log('register after signing in ok', data);
			});
		});
		$rootScope.on('principal-remove', function(){
			$ionicPush.unregister();
		});
	}
});
