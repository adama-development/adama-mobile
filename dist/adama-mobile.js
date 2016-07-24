'use strict';

angular.module('adama-mobile', [ //
	'ionic', //
	'ionic.service.core', //
	'ionic.service.auth', //
	'ionic.service.deploy', //
	'ionic.service.push', //
	'pascalprecht.translate', //
	'ngCookies', //
	'ngResource', //
	'LocalStorageModule', //
	'ngCordova', //
	'angular-jwt', //
	'angular-logger', //
	'ngMessages' //
]);

/* globals StatusBar:false, cordova: false */

'use strict';

angular.module('adama-mobile').run(["$ionicPlatform", function($ionicPlatform) {
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
}]);

angular.module('adama-mobile').config(["$urlRouterProvider", function($urlRouterProvider) {
	// see https://github.com/angular-ui/ui-router/issues/600#issuecomment-47228922
	$urlRouterProvider.otherwise(function($injector) {
		var $state = $injector.get('$state');
		$state.go('app.main');
	});
}]);

angular.module('adama-mobile').config(["$translateProvider", function($translateProvider) {
	$translateProvider.useSanitizeValueStrategy('escapeParameters');

	$translateProvider.useLocalStorage();

	$translateProvider.registerAvailableLanguageKeys(['en', 'fr'], {
		'en_*': 'en',
		'fr_*': 'fr'
	});

	$translateProvider.determinePreferredLanguage().fallbackLanguage('en');
}]);

angular.module('adama-mobile').config(["$stateProvider", "adamaConstant", function($stateProvider, adamaConstant) {
	$stateProvider.state('app', {
		abstract: true,
		url: '/app',
		templateUrl: function() {
			return adamaConstant.adamaMobileToolkitTemplateUrl.app;
		}
	});
}]);

angular.module('adama-mobile').run(["$rootScope", "pageTitle", function($rootScope, pageTitle) {
	$rootScope.$on('$stateChangeSuccess', function(event, toState) {
		if (toState && toState.data && toState.data.pageTitle) {
			pageTitle.set(toState.data.pageTitle);
		}
	});
}]);

angular.module('adama-mobile').config(["$httpProvider", function($httpProvider) {
	$httpProvider.interceptors.push('authExpiredInterceptor');
	$httpProvider.interceptors.push('authInterceptor');
}]);

angular.module('adama-mobile').run(["$rootScope", "$state", "principalService", function($rootScope, $state, principalService) {
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
}]);

angular.module('adama-mobile').run(["$rootScope", function($rootScope) {
	$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
		throw error;
	});
}]);

angular.module('adama-mobile').run(["$rootScope", "$injector", "adamaConstant", function($rootScope, $injector, adamaConstant) {
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
}]);

angular.module('adama-mobile').run(["$rootScope", "$injector", "$log", "adamaConstant", function($rootScope, $injector, $log, adamaConstant) {
	var log = $log.getInstance('adama-mobile.run.push');
	var $ionicPlatform, $ionicPush, $ionicUser;
	if (adamaConstant.enablePush) {
		$ionicPlatform = $injector.get('$ionicPlatform');
		$ionicPush = $injector.get('$ionicPush');
		$ionicUser = $injector.get('$ionicUser');
		$ionicPlatform.ready(function() {
			$ionicPush.init({
				debug: false,
				onNotification: function(notification) {
					$rootScope.$apply(function() {
						// TODO notification management
						var payload = $ionicPush.getPayload(notification);
						log.debug('notification, payload', notification, payload);
						$rootScope.notification = notification;
						$rootScope.payload = payload;
						if (notification.app.asleep || notification.app.closed) {
							// $state.go('tab.push');
							log.debug('application was asleep or closed');
						}
					});
				},
				onRegister: function(data) {
					log.debug('Device token', data.token);
				},
				canShowAlert: false,
				canSetBadge: true,
				canPlaySound: true,
				canRunActionsOnWake: true
			});
			if ($ionicUser.current().isAuthenticated()) {
				$ionicPush.register(function(data) {
					log.debug('register at startup ok', data);
					$ionicPush.saveToken(data);
				});
			} else {
				$ionicPush.unregister();
			}
		});
		$rootScope.$on('ionicuser-new', function() {
			$ionicPush.register(function(data) {
				log.debug('register after signing in ok', data);
			});
		});
		$rootScope.$on('principal-remove', function() {
			$ionicPush.unregister();
		});
	}
}]);

angular.module('adama-mobile').config(["logEnhancerProvider", function(logEnhancerProvider) {
	logEnhancerProvider.prefixPattern = '%s::[%s]>';
	logEnhancerProvider.datetimePattern = 'DD/MM/YYYY HH:mm:ss';
	logEnhancerProvider.logLevels = {
		'*': logEnhancerProvider.LEVEL.OFF
	};
}]);

'use strict';

angular.module('adama-mobile').controller('AccessDeniedCtrl', function() {
	// nothing to do
});

'use strict';

angular.module('adama-mobile').config(["$stateProvider", "adamaConstant", function($stateProvider, adamaConstant) {
	$stateProvider.state('auth', {
		abstract: true,
		url: '/auth',
		template: '' + //
			'<ui-view></ui-view>' + //
			''
	});

	$stateProvider.state('auth.signin', {
		url: '/',
		templateUrl: function() {
			return adamaConstant.adamaMobileToolkitTemplateUrl.authSignin;
		},
		controller: 'SigninCtrl',
		controllerAs: '$ctrl',
		data: {
			pageTitle: 'SIGNIN',
			authorities: []
		}
	});

	$stateProvider.state('auth.recoverPassword', {
		url: '/recoverPassword',
		templateUrl: function() {
			return adamaConstant.adamaMobileToolkitTemplateUrl.authRecover;
		},
		controller: 'RecoverPasswordCtrl',
		controllerAs: '$ctrl',
		data: {
			pageTitle: 'RECOVER',
			authorities: []
		}
	});

	$stateProvider.state('auth.accessDenied', {
		url: '/accessDenied',
		templateUrl: function() {
			return adamaConstant.adamaMobileToolkitTemplateUrl.authAccessDenied;
		},
		controller: 'AccessDeniedCtrl',
		controllerAs: '$ctrl',
		data: {
			pageTitle: 'ACCESS_DENIED',
			authorities: []
		}
	});
}]);

angular.module('adama-mobile').config(["$translateProvider", function($translateProvider) {
	$translateProvider.translations('fr', {
		'SIGNIN': 'Identification',
		'SIGNIN_INTRO': 'Identifiez-vous pour démarrer votre session',
		'SIGNIN_FORGET_PASSWORD': 'J\'ai oublié mon mot de passe ...',
		'SIGNIN_USERNAME': 'Identifiant',
		'SIGNIN_USERNAME_REQUIRED': 'L\'identifiant est obligatoire',
		'SIGNIN_PASSWORD': 'Mot de passe',
		'SIGNIN_PASSWORD_REQUIRED': 'Le mot de passe est obligatoire',
		'SIGNIN_SUBMIT': 'Démarrer la session',
		'SIGNIN_LOADING': 'Données en cours de chargement',
		'SIGNIN_ERROR_TITLE': 'Erreur d\'authentification',
		'SIGNIN_ERROR_MESSAGE': 'Identifiant ou mot de passe incorrect.',
		'RECOVER': 'Récupération de mot de passe',
		'RECOVER_INTRO': 'Saisissez votre email pour récupérer votre mot de passe',
		'RECOVER_MAIL': 'Email',
		'RECOVER_MAIL_REQUIRED': 'L\'email est obligatoire',
		'RECOVER_MAIL_EMAIL': 'L\'email n\'est pas au bon format',
		'RECOVER_SUBMIT': 'Récupérer mon mot de passe',
		'RECOVER_BACK_TO_LOGIN': 'Retour à l\'identificaition',
		'RECOVER_SUCCESS': 'Consultez votre email pour connaître comment réinitialiser votre mot de passe.',
		'RECOVER_ERROR_TITLE': 'Erreur',
		'RECOVER_ERROR_GENERIC': 'Erreur lors de la récupération du mot de passe.',
		'RECOVER_ERROR_EMAIL_NOT_EXIST': 'L\'email n\'existe pas',
		'ACCESS_DENIED_BACK_TO_HOME': 'Retour à l\'accueil',
		'ACCESS_DENIED': 'Accès interdit',
		'ACCESS_DENIED_INTRO': 'Vous n\'avez pas suffisamment de droits d\'accéder à cette page.'
	});

	$translateProvider.translations('en', {
		'SIGNIN': 'Signin',
		'SIGNIN_INTRO': 'Sign in to start your session',
		'SIGNIN_FORGET_PASSWORD': 'I forgot my password ...',
		'SIGNIN_USERNAME': 'Username',
		'SIGNIN_USERNAME_REQUIRED': 'Username is required',
		'SIGNIN_PASSWORD': 'Password',
		'SIGNIN_PASSWORD_REQUIRED': 'Password is required',
		'SIGNIN_SUBMIT': 'Start session',
		'SIGNIN_LOADING': 'Loading user informations',
		'SIGNIN_ERROR_TITLE': 'Authentication error',
		'SIGNIN_ERROR_MESSAGE': 'Username or password are incorrect.',
		'RECOVER': 'Recover password',
		'RECOVER_INTRO': 'Set your email to recover your password',
		'RECOVER_MAIL': 'Email',
		'RECOVER_MAIL_REQUIRED': 'Email is required',
		'RECOVER_MAIL_EMAIL': 'Email does not respect the right format',
		'RECOVER_SUBMIT': 'Retrieve my password',
		'RECOVER_BACK_TO_LOGIN': 'Back to signin',
		'RECOVER_SUCCESS': 'Check your e-mails for details on how to reset your password.',
		'RECOVER_ERROR_TITLE': 'Error',
		'RECOVER_ERROR_GENERIC': 'Recovering error.',
		'RECOVER_ERROR_EMAIL_NOT_EXIST': 'E-Mail address isn\'t registered! Please check and try again',
		'ACCESS_DENIED_BACK_TO_HOME': 'Back to home',
		'ACCESS_DENIED': 'Access denied',
		'ACCESS_DENIED_INTRO': 'You do not have enough privileges to access this page.'
	});
}]);

'use strict';

angular.module('adama-mobile').controller('RecoverPasswordCtrl', ["$filter", "$ionicPopup", "principalService", function($filter, $ionicPopup, principalService) {
	var ctrl = this;
	ctrl.recover = function(userEmail) {
		ctrl.recoverSuccess = false;
		ctrl.recoverError = false;
		ctrl.errorEmailNotExists = false;
		ctrl.loading = true;
		principalService.resetPasswordInit(userEmail).then(function() {
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
}]);

'use strict';

angular.module('adama-mobile').controller('SigninCtrl', ["$rootScope", "$state", "$log", "authService", "$filter", "$ionicPopup", function($rootScope, $state, $log, authService, $filter, $ionicPopup) {
	var log = $log.getInstance('adama-mobile.auth.signin');
	var ctrl = this;
	ctrl.loading = false;
	ctrl.signin = function(userName, userPassword) {
		ctrl.loading = true;
		authService.login(userName, userPassword).then(function() {
			log.debug('user is logged, rediret to app.main');
			$state.go('app.main');
			ctrl.loading = false;
		}).catch(function(rejection) {
			log.info('error while signing in', rejection);
			ctrl.rejection = rejection;
			var translateFn = $filter('translate');
			$ionicPopup.alert({
				title: translateFn('SIGNIN_ERROR_TITLE'),
				template: translateFn('SIGNIN_ERROR_MESSAGE')
			});
			ctrl.loading = false;
		});
	};
}]);

'use strict';

angular.module('adama-mobile').config(["$translateProvider", function($translateProvider) {
	$translateProvider.translations('fr', {
		'BTN_SIGNOUT': 'Déconnexion'
	});

	$translateProvider.translations('en', {
		'BTN_SIGNOUT': 'Sign out'
	});
}]);

'use strict';

angular.module('adama-mobile').component('btnSignout', {
	templateUrl: 'adama-mobile/btn-signout/btn-signout.html',
	controller: ["authService", "$state", function(authService, $state) {
		var ctrl = this;
		ctrl.signout = function() {
			authService.logout();
			$state.go('auth.signin');
		};
	}]
});

'use strict';

angular.module('adama-mobile').directive('dsBinaryFileUrl', ["$parse", "binaryFileService", function($parse, binaryFileService) {
	return {
		scope: false,
		link: function(scope, element, attrs) {
			var updateOutput = function(binaryFileList) {
				if (attrs.output) {
					binaryFileList = angular.copy(binaryFileList);
				}
				if (!angular.isArray(binaryFileList)) {
					binaryFileList = [binaryFileList];
				}
				binaryFileService.initUrlForBinaryFiles(binaryFileList).then(function() {
					if (attrs.output) {
						$parse(attrs.output).assign(scope, binaryFileList);
					}
				});
			};
			scope.$watch(attrs.input, function() {
				var binaryFileList = $parse(attrs.input)(scope);
				if (binaryFileList) {
					updateOutput(binaryFileList);
				}
			});
		}
	};
}]);

'use strict';

angular.module('adama-mobile').directive('dsLanguage', ["$parse", "language", function($parse, language) {
	return {
		scope: false,
		link: function(scope, element, attrs) {
			language.getAll().then(function(languages) {
				$parse(attrs.data).assign(scope, languages);
			});
		}
	};
}]);

'use strict';

angular.module('adama-mobile').directive('dsPrincipalIdentity', ["$rootScope", "$parse", "principalService", function($rootScope, $parse, principalService) {
	return {
		scope: false,
		link: function(scope, element, attrs) {
			$rootScope.$on('principal-new', function(event, data) {
				$parse(attrs.data).assign(scope, data.principal);
			});
			$rootScope.$on('principal-remove', function() {
				$parse(attrs.data).assign(scope, undefined);
			});
			principalService.getPrincipal().then(function(principal) {
				$parse(attrs.data).assign(scope, principal);
			});
		}
	};
}]);

/*jshint -W069 */
/*jscs:disable requireDotNotation*/
'use strict';

angular.module('adama-mobile').factory('authExpiredInterceptor', ["$injector", "$q", "$log", "adamaConstant", function($injector, $q, $log, adamaConstant) {
	var getHttpService = (function() {
		var service;
		return function() {
			return service || (service = $injector.get('$http'));
		};
	}());

	var getAdamaTokenService = (function() {
		var service;
		return function() {
			return service || (service = $injector.get('adamaTokenService'));
		};
	}());

	var getStateService = (function() {
		var service;
		return function() {
			return service || (service = $injector.get('$state'));
		};
	}());

	return {
		responseError: function(response) {
			var config = response.config;
			if (response.status === 401 && config.url.indexOf(adamaConstant.apiBase) === 0) {
				var log = $log.getInstance('adama-mobile.interceptors.authExpiredInterceptor');
				log.debug('error 401, refresh token', config.url);
				return getAdamaTokenService().refreshAndGetToken().then(function() {
					log.debug('token is refresh, reset Authorization header');
					config.headers['Authorization'] = undefined;
					return getHttpService()(config);
				}, function(rejection) {
					return getStateService().go('auth.signin').then(function() {
						log.debug('error while getting user token', rejection);
						return $q.reject(rejection);
					});
				});
			}
			return $q.reject(response);
		}
	};
}]);

/*jshint -W069 */
/*jscs:disable requireDotNotation*/
'use strict';

angular.module('adama-mobile').factory('authInterceptor', ["$injector", "$q", "$log", "adamaConstant", function($injector, $q, $log, adamaConstant) {
	var getAdamaTokenService = (function() {
		var service;
		return function() {
			return service || (service = $injector.get('adamaTokenService'));
		};
	}());

	var getStateService = (function() {
		var service;
		return function() {
			return service || (service = $injector.get('$state'));
		};
	}());

	return {
		// Add authorization token to headers
		request: function(config) {
			var log = $log.getInstance('adama-mobile.interceptors.authInterceptor');
			log.debug('url', config.url);
			config.headers = config.headers || {};
			if (!config.headers['Authorization'] && config.url.indexOf(adamaConstant.apiBase) === 0) {
				log.debug('need authorization, getting token');
				return getAdamaTokenService().getToken().then(function(token) {
					log.debug('adding Authorization header', token);
					if (token) {
						config.headers['Authorization'] = 'Bearer ' + token;
					}
					return config;
				}, function(rejection) {
					return getStateService().go('auth.signin').then(function() {
						log.debug('error while getting user token', rejection);
						return $q.reject(rejection);
					});
				});
			}
			return config;
		}
	};
}]);

'use strict';

angular.module('adama-mobile').factory('User', ["$resource", "adamaConstant", "adamaResourceConfig", function($resource, adamaConstant, adamaResourceConfig) {
	var config = angular.extend({}, adamaResourceConfig, {
		'delete': {
			method: 'DELETE',
			params: {
				id: '@id'
			}
		}
	});
	return $resource(adamaConstant.apiBase + 'users/:id', {}, config);
}]);

'use strict';

angular.module('adama-mobile').factory('adamaResourceConfig', ["ParseLinks", function(ParseLinks) {
	return {
		'query': {
			method: 'GET',
			isArray: true,
			transformResponse: function(data, headers, status) {
				data = angular.fromJson(data);
				if (status === 200) {
					data.$metadata = {
						links: ParseLinks.parse(headers('link')),
						totalItems: headers('X-Total-Count')
					};
				}
				return data;
			},
			interceptor: {
				response: function(response) {
					response.resource.$metadata = response.data.$metadata;
					return response.resource;
				}
			}
		},
		'get': {
			method: 'GET'
		},
		'save': {
			method: 'POST'
		},
		'update': {
			method: 'PUT'
		},
		'delete': {
			method: 'DELETE',
			params: {
				id: '@id'
			}
		}
	};
}]);

/* jscs:disable requireCamelCaseOrUpperCaseIdentifiers */
/* jshint camelcase:false */

'use strict';

angular.module('adama-mobile').factory('adamaTokenService', ["$rootScope", "$http", "$q", "$state", "$ionicUser", "$log", "jwtHelper", "adamaConstant", function($rootScope, $http, $q, $state, $ionicUser, $log, jwtHelper, adamaConstant) {
	var log = $log.getInstance('adama-mobile.services.adamaTokenService');
	var api = {};

	var ionicUser = $ionicUser.current();
	$rootScope.$on('ionicuser-new', function() {
		log.debug('update ionicUser');
		ionicUser = $ionicUser.current();
	});

	api.getToken = function() {
		log.debug('getToken');
		var token;
		if (ionicUser.isAuthenticated()) {
			log.debug('getToken user is authenticated');
			token = ionicUser.get('access_token');
			if (token && jwtHelper.isTokenExpired(token)) {
				log.debug('getToken token is expired');
				return api.refreshAndGetToken();
			}
		}
		return $q.when(token);
	};

	api.refreshAndGetToken = function() {
		log.debug('refreshAndGetToken');
		var token = ionicUser.get('access_token');
		if (!token) {
			// FIXME should not occur as ionicUser should always have a
			// access_token
			log.info('no token, redirect to signin');
			log.debug('for debugging purpose, here is the ionic current user', ionicUser);
			log.debug('for debugging purpose, here is the ionic current user.isAuthenticated', ionicUser.isAuthenticated());
			log.debug('for debugging purpose, here is a JSON.stringify version of ionic current user', JSON.stringify(ionicUser));
			return $q.reject('refreshAndGetToken : no token !!!!');
		}
		log.debug('refreshAndGetToken token', token);
		var refreshToken = ionicUser.get('refresh_token');
		log.debug('refreshAndGetToken refreshToken', refreshToken);
		return $http({
			method: 'POST',
			url: adamaConstant.apiBase + 'login/refresh',
			headers: {
				'Authorization': 'Bearer ' + token
			},
			data: {
				'refresh_token': refreshToken
			}
		}).then(function(response) {
			var newToken = response.data.access_token;
			log.debug('refreshAndGetToken newToken', newToken);
			ionicUser.set('access_token', newToken);
			return ionicUser.save().then(function() {
				return newToken;
			});
		}, function(rejection) {
			log.info('error while refreshing user token, redirect to signin', rejection);
			return $q.reject(rejection);
		});
	};

	return api;
}]);

'use strict';

angular.module('adama-mobile').constant('adamaConstant', {
	apiBase: 'http://localhost:13337/',
	adamaMobileToolkitTemplateUrl: {
		app: 'adama-mobile/app.html',
		authAccessDenied: 'adama-mobile/auth/accessDenied.html',
		authSignin: 'adama-mobile/auth/signin.html',
		authRecover: 'adama-mobile/auth/recoverPassword.html'
	},
	enableBadge: false,
	enablePush: false,
	urlResetPassword: 'path/to/reset/password?origin=mobile'
});

'use strict';

angular.module('adama-mobile').factory('authService', ["$rootScope", "$http", "$ionicAuth", "$log", "adamaConstant", "principalService", function($rootScope, $http, $ionicAuth, $log, adamaConstant, principalService) {
	var log = $log.getInstance('adama-mobile.services.authService');
	var api = {};

	api.login = function(username, password) {
		log.debug('login', username);
		var authOptions = {
			remember: true
		};
		var data = {
			username: username,
			password: password
		};
		return $ionicAuth.login('custom', authOptions, data).then(function() {
			log.debug('login is ok, ask custom auth server to refresh the user data');
			return $http({
				method: 'POST',
				url: adamaConstant.apiBase + 'externalLogin/refreshUserExternal',
				data: {
					externalId: username
				}
			});
		}).then(function() {
			log.debug('refreshing custom auth server is ok, ask the backend for the updated user info');
			$rootScope.$broadcast('ionicuser-new');
			// get the new user information from ionic
			return principalService.resetPrincipal();
		}).then(function() {
			log.debug('user is logged in in both ionic and backend');
		});
	};

	api.logout = function() {
		log.debug('logout');
		$ionicAuth.logout();
		principalService.deletePrincipal();
	};

	return api;
}]);

'use strict';

angular.module('adama-mobile').factory('binaryFileService', ["$http", "$q", "adamaConstant", function($http, $q, adamaConstant) {
	var api = {};

	api.initUrlForBinaryFiles = function(binaryFileList) {
		var workingList = [];
		var idList = [];
		angular.forEach(binaryFileList, function(binaryFile) {
			if (binaryFile && binaryFile.id && !binaryFile.url) {
				workingList.push(binaryFile);
				idList.push(binaryFile.id);
			}
		});
		if (idList.length) {
			return $http({
				method: 'PUT',
				url: adamaConstant.apiBase + 'files',
				data: angular.toJson(idList)
			}).then(function(response) {
				angular.forEach(workingList, function(binaryFile) {
					binaryFile.url = response.data.urlList[binaryFile.id];
				});
			});
		}
		return $q.when();
	};

	return api;
}]);

'use strict';

angular.module('adama-mobile').provider('language', function() {
	var languages = ['en', 'fr'];
	var selectorData = [{
		code: 'en',
		labelKey: 'FLAG_EN',
		cssCLass: 'us'
	}, {
		code: 'fr',
		labelKey: 'FLAG_FR',
		cssCLass: 'fr'
	}];

	this.setLanguages = function(newLanguages) {
		languages = newLanguages;
	};

	this.setSelectorData = function(newSelectorData) {
		selectorData = newSelectorData;
	};

	this.$get = ["$q", "$http", "$translate", function($q, $http, $translate) {
		var api = {};

		api.getCurrent = function() {
			var language = $translate.storage().get('NG_TRANSLATE_LANG_KEY');
			if (angular.isUndefined(language)) {
				language = 'en';
			}
			return $q.when(language);
		};

		api.getAll = function() {
			return $q.when(languages);
		};

		api.getSelectorData = function() {
			return $q.when(selectorData);
		};

		return api;
	}];
});

'use strict';

angular.module('adama-mobile').factory('loadingService', ["$filter", "$ionicLoading", function($filter, $ionicLoading) {
	var api = {};
	var translateFn = $filter('translate');

	api.blockUiWhileResolving = function(messageKey, promise) {
		if (promise.$$state.status === 0) {
			$ionicLoading.show({
				template: translateFn(messageKey)
			});
		}
		return promise.finally(function() {
			$ionicLoading.hide();
		});
	};

	return api;
}]);

'use strict';

angular.module('adama-mobile').factory('notificationsService', ["$filter", "$cordovaToast", "$log", function($filter, $cordovaToast, $log) {
	var log = $log.getInstance('adama-mobile.services.notificationsService');
	var api = {};
	var translateFn = $filter('translate');

	api.show = function(messageKey) {
		log.debug('show', messageKey);
		return $cordovaToast.show(translateFn(messageKey), 'short', 'bottom');
	};

	return api;
}]);

'use strict';

angular.module('adama-mobile').factory('pageTitle', ["$rootScope", "$filter", function($rootScope, $filter) {
	var translateFn = $filter('translate');
	var api = {};

	api.set = function(pageTitleKey, data) {
		var newTitle = translateFn(pageTitleKey, data);
		$rootScope.pageTitle = newTitle;
	};

	return api;
}]);

'use strict';

angular.module('adama-mobile').service('ParseLinks', function() {
	this.parse = function(header) {
		if (header.length === 0) {
			throw new Error('input must not be of zero length');
		}

		// Split parts by comma
		var parts = header.split(',');
		var links = {};
		// Parse each part into a named link
		angular.forEach(parts, function(p) {
			var section = p.split(';');
			if (section.length !== 2) {
				throw new Error('section could not be split on ";"');
			}
			var url = section[0].replace(/<(.*)>/, '$1').trim();
			var queryString = {};
			url.replace(new RegExp('([^?=&]+)(=([^&]*))?', 'g'), function($0, $1, $2, $3) {
				queryString[$1] = $3;
			});
			var page = queryString.page;
			if (angular.isString(page)) {
				page = parseInt(page);
			}
			var name = section[1].replace(/rel='(.*)'/, '$1').trim();
			links[name] = page;
		});

		return links;
	};
});

/*jshint -W069 */
/*jscs:disable requireDotNotation*/
'use strict';

angular.module('adama-mobile').factory('principalService', ["$rootScope", "$q", "$http", "$resource", "$state", "$ionicUser", "$log", "adamaConstant", function($rootScope, $q, $http, $resource, $state, $ionicUser, $log, adamaConstant) {
	var log = $log.getInstance('adama-mobile.services.principalService');
	var api = {};
	var principalPromise;
	var ionicUser = $ionicUser.current();
	var isAuthenticated = ionicUser.isAuthenticated();
	var accountResource = $resource(adamaConstant.apiBase + 'account', {}, {});
	var passwordResource = $resource(adamaConstant.apiBase + 'account/change_password', {}, {});
	var passwordResetInitResource = $resource(adamaConstant.apiBase + 'account/reset_password/init', {}, {});

	api.isAuthenticated = function() {
		return isAuthenticated;
	};

	api.resetPrincipal = function() {
		var result;
		ionicUser = $ionicUser.current();
		isAuthenticated = ionicUser.isAuthenticated();
		log.debug('resetPrincipal');
		log.debug('resetPrincipal ionicUser', ionicUser);
		log.debug('resetPrincipal isAuthenticated', isAuthenticated);
		if (isAuthenticated) {
			var externalId = ionicUser.details['external_id'];
			if (!externalId) {
				// FIXME should not occur, every ionicuser should have an
				// external_id
				log.info('no external_id, redirect to signin');
				result = $q.reject('resetPrincipal : no external_id');
			} else {
				principalPromise = $http({
					method: 'GET',
					url: adamaConstant.apiBase + 'users/byLogin/' + externalId
				}).then(function(response) {
					var principal = response.data;
					isAuthenticated = true;
					$rootScope.$broadcast('principal-new', {
						principal: principal
					});
					return principal;
				});
				result = principalPromise;
			}
		} else {
			log.info('user is not authenticated');
			result = $q.reject('resetPrincipal : not authenticated');
		}
		return result.catch(function(rejection) {
			log.debug('there was a problem while reseting user info, redirect to signin');
			isAuthenticated = false;
			principalPromise = undefined;
			$state.go('auth.signin');
			return $q.reject(rejection);
		});
	};

	api.getPrincipal = function() {
		if (!principalPromise) {
			return api.resetPrincipal();
		}
		return principalPromise;
	};

	api.deletePrincipal = function() {
		isAuthenticated = false;
		principalPromise = undefined;
		$rootScope.$broadcast('principal-remove');
	};

	api.hasAnyAuthority = function(authorities) {
		log.debug('hasAnyAuthority', authorities);
		// TODO
		return true;
	};

	api.resetPasswordInit = function(mail) {
		log.debug('resetPasswordInit', mail);
		return passwordResetInitResource.save({
			mail: mail,
			urlResetPassword: adamaConstant.urlResetPassword
		}).$promise;
	};

	api.updateAccount = function(principal) {
		log.debug('updateAccount', principal);
		return accountResource.save(principal, function() {
			$rootScope.$emit('principal-update', {
				principal: principal
			});
			principalPromise = $q.when(principal);
		}).$promise;
	};

	api.changePassword = function(newPassword) {
		log.debug('changePassword');
		return passwordResource.save({
			password: newPassword
		}).$promise;
	};

	return api;
}]);

//# sourceMappingURL=adama-mobile.js.map
