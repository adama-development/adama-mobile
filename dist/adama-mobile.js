/* globals StatusBar:false, cordova: false */

'use strict';

angular.module('adama-mobile', [ //
	'ionic', //
	'pascalprecht.translate', //
	'ngCookies', //
	'ngResource', //
	'LocalStorageModule', //
	'ngMessages' //
]);

angular.module('adama-mobile').run(["$ionicPlatform", function($ionicPlatform) {
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
}]);

angular.module('adama-mobile').config(["$urlRouterProvider", function($urlRouterProvider) {
	$urlRouterProvider.otherwise('/app/');
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

angular.module('adama-mobile').config(["$stateProvider", "jHipsterConstant", function($stateProvider, jHipsterConstant) {
	$stateProvider.state('app', {
		abstract: true,
		url: '/app',
		templateUrl: function() {
			return jHipsterConstant.adamaMobileToolkitTemplateUrl.app;
		},
		resolve: {
			authorize: ["Auth", function(Auth) {
				return Auth.authorize();
			}]
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

angular.module('adama-mobile').run(["$rootScope", function($rootScope) {
	$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
		throw error;
	});
}]);

'use strict';

angular.module('adama-mobile').controller('AccessDeniedCtrl', function() {
	// nothing to do
});

'use strict';

angular.module('adama-mobile').config(["$stateProvider", "jHipsterConstant", function($stateProvider, jHipsterConstant) {
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
			return jHipsterConstant.adamaMobileToolkitTemplateUrl.authSignin;
		},
		controller: 'SigninCtrl',
		controllerAs: 'ctrl',
		data: {
			pageTitle: 'SIGNIN',
			authorities: []
		}
	});

	$stateProvider.state('auth.accessDenied', {
		url: '/accessDenied',
		templateUrl: function() {
			return jHipsterConstant.adamaMobileToolkitTemplateUrl.authAccessDenied;
		},
		controller: 'AccessDeniedCtrl',
		controllerAs: 'ctrl',
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
		'SIGNIN_ERROR_TITLE': 'Erreur d\'authentification',
		'SIGNIN_ERROR_MESSAGE': 'Identifiant ou mot de passe incorrect.',
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
		'SIGNIN_ERROR_TITLE': 'Authentication error',
		'SIGNIN_ERROR_MESSAGE': 'Username or password are incorrect.',
		'RECOVER_SUBMIT': 'Retrieve my password',
		'ACCESS_DENIED_BACK_TO_HOME': 'Back to home',
		'ACCESS_DENIED': 'Access denied',
		'ACCESS_DENIED_INTRO': 'You do not have enough privileges to access this page.'
	});
}]);

'use strict';

angular.module('adama-mobile').controller('SigninCtrl', ["$rootScope", "$state", "Auth", "$filter", "$ionicPopup", function($rootScope, $state, Auth, $filter, $ionicPopup) {
	var ctrl = this;
	ctrl.signin = function(userName, userPassword) {
		Auth.login({
			username: userName,
			password: userPassword
		}).then(function() {
			if ($rootScope.previousStateName === 'auth.signin') {
				$state.go('app.main');
			} else {
				$rootScope.back();
			}
		}).catch(function() {
			var translateFn = $filter('translate');
			$ionicPopup.alert({
				title: translateFn('SIGNIN_ERROR_TITLE'),
				template: translateFn('SIGNIN_ERROR_MESSAGE')
			});
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

angular.module('adama-mobile').directive('btnSignout', function() {
	return {
		templateUrl: 'adama-mobile/btn-signout/btn-signout.html',
		restrict: 'E',
		scope: {},
		bindToController: {},
		controller: ["Auth", "$state", function(Auth, $state) {
			var ctrl = this;
			ctrl.signout = function() {
				Auth.logout();
				$state.go('auth.signin');
			};
		}],
		controllerAs: 'ctrl'
	};
});

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

angular.module('adama-mobile').directive('dsPrincipalIdentity', ["$parse", "Principal", function($parse, Principal) {
	return {
		scope: false,
		link: function(scope, element, attrs) {
			Principal.identity().then(function(account) {
				$parse(attrs.data).assign(scope, account);
			});
		}
	};
}]);

'use strict';

angular.module('adama-mobile').run(["$rootScope", "$state", "Principal", "Auth", function($rootScope, $state, Principal, Auth) {
	$rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
		$rootScope.toState = toState;
		$rootScope.toStateParams = toStateParams;
		if (Principal.isIdentityResolved()) {
			Auth.authorize();
		}
	});

	$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
		// Remember previous state unless we've been redirected to login or
		// we've just reset the state memory after logout. If we're redirected
		// to login, our previousState is already set in the
		// authExpiredInterceptor. If we're going to login directly, we don't
		// want to be sent to some previous state anyway
		if (toState.name !== 'auth.signin' && $rootScope.previousStateName) {
			$rootScope.previousStateName = fromState.name;
			$rootScope.previousStateParams = fromParams;
		}
	});

	$rootScope.back = function() {
		// If previous state is 'activate' or do not exist go to 'home'
		if ($state.get($rootScope.previousStateName) === null) {
			$state.go('app.main');
		} else {
			$state.go($rootScope.previousStateName, $rootScope.previousStateParams);
		}
	};
}]);

angular.module('adama-mobile').config(["$httpProvider", function($httpProvider) {
	// $httpProvider.interceptors.push('errorHandlerInterceptor');
	$httpProvider.interceptors.push('authExpiredInterceptor');
	$httpProvider.interceptors.push('authInterceptor');
	// $httpProvider.interceptors.push('notificationInterceptor');
}]);

'use strict';

angular.module('adama-mobile').constant('jHipsterConstant', {
	apiBase: 'http://localhost:13337/',
	appModule: 'mySuperApp',
	adamaMobileToolkitTemplateUrl: {
		app: 'adama-mobile/app.html',
		authAccessDenied: 'adama-mobile/auth/accessDenied.html',
		authSignin: 'adama-mobile/auth/signin.html'
	}
});

'use strict';

angular.module('adama-mobile').factory('jHipsterResourceConfig', ["ParseLinks", function(ParseLinks) {
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

'use strict';

angular.module('adama-mobile').factory('User', ["$resource", "jHipsterConstant", "jHipsterResourceConfig", function($resource, jHipsterConstant, jHipsterResourceConfig) {
	var config = angular.extend({}, jHipsterResourceConfig, {
		'delete': {
			method: 'DELETE',
			params: {
				login: '@login'
			}
		}
	});
	return $resource(jHipsterConstant.apiBase + 'api/users/:login', {}, config);
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

angular.module('adama-mobile').factory('pageTitle', ["$rootScope", "$filter", function($rootScope, $filter) {
	var translateFn = $filter('translate');
	var api = {};

	api.set = function(pageTitleKey) {
		var newTitle = translateFn(pageTitleKey);
		$rootScope.pageTitle = newTitle;
	};

	return api;
}]);

'use strict';

angular.module('adama-mobile')
	.directive('jhAlert', ["AlertService", function(AlertService) {
		return {
			restrict: 'E',
			template: '<div class="content-wrapper" ng-cloak ng-if="alerts && alerts.length">' +
				'<div class="box-body">' +
				'<div ng-repeat="alert in alerts" class="alert alert-dismissible" ng-class="\'alert-\' + alert.type">' +
				'<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>' +
				'{{ alert.msg }}' +
				'</div>' +
				'</div>' +
				'</div>',
			controller: ['$scope',
				function($scope) {
					$scope.alerts = AlertService.get();
					$scope.$on('$destroy', function() {
						$scope.alerts = [];
					});
				}
			]
		};
	}])
	.directive('jhAlertError', ["AlertService", "$rootScope", "$translate", function(AlertService, $rootScope, $translate) {
		return {
			restrict: 'E',
			template: '<div class="alerts" ng-if="alerts && alerts.length">' +
				'<div ng-repeat="alert in alerts" class="alert alert-dismissible" ng-class="\'alert-\' + alert.type">' +
				'<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>' +
				'{{ alert.msg }}' +
				'</div>' +
				'</div>',
			controller: ['$scope', 'jHipsterConstant',
				function($scope, jHipsterConstant) {

					$scope.alerts = [];

					var addErrorAlert = function(message, key, data) {
						key = key && key !== null ? key : message;
						$scope.alerts.push(
							AlertService.add({
									type: 'danger',
									msg: key,
									params: data,
									timeout: 5000,
									toast: AlertService.isToast(),
									scoped: true
								},
								$scope.alerts
							)
						);
					};

					var cleanHttpErrorListener = $rootScope.$on(jHipsterConstant.appModule + '.httpError', function(event, httpResponse) {
						var i;
						event.stopPropagation();
						switch (httpResponse.status) {
							// connection refused, server not reachable
							case 0:
								addErrorAlert('Server not reachable', 'error.server.not.reachable');
								break;

							case 400:
								var errorHeader = httpResponse.headers('X-' + jHipsterConstant.appModule + '-error');
								var entityKey = httpResponse.headers('X-' + jHipsterConstant.appModule + '-params');
								if (errorHeader) {
									var entityName = $translate.instant('global.menu.entities.' + entityKey);
									addErrorAlert(errorHeader, errorHeader, {
										entityName: entityName
									});
								} else if (httpResponse.data && httpResponse.data.fieldErrors) {
									for (i = 0; i < httpResponse.data.fieldErrors.length; i++) {
										var fieldError = httpResponse.data.fieldErrors[i];
										// convert 'something[14].other[4].id'
										// to 'something[].other[].id' so
										// translations can be written to it
										var convertedField = fieldError.field.replace(/\[\d*\]/g, '[]');
										var fieldName = $translate.instant(jHipsterConstant.appModule + '.' + fieldError.objectName + '.' + convertedField);
										addErrorAlert('Field ' + fieldName + ' cannot be empty', 'error.' + fieldError.message, {
											fieldName: fieldName
										});
									}
								} else if (httpResponse.data && httpResponse.data.message) {
									addErrorAlert(httpResponse.data.message, httpResponse.data.message, httpResponse.data);
								} else {
									addErrorAlert(httpResponse.data);
								}
								break;

							default:
								if (httpResponse.data && httpResponse.data.message) {
									addErrorAlert(httpResponse.data.message);
								} else {
									addErrorAlert(JSON.stringify(httpResponse));
								}
						}
					});

					$scope.$on('$destroy', function() {
						if (cleanHttpErrorListener !== undefined && cleanHttpErrorListener !== null) {
							cleanHttpErrorListener();
							$scope.alerts = [];
						}
					});
				}
			]
		};
	}]);

'use strict';

angular.module('adama-mobile')
	.provider('AlertService', function() {
		var toast = false;

		this.$get = ['$timeout', '$sce', '$translate', function($timeout, $sce, $translate) {

			var alertId = 0; // unique id for each alert. Starts from 0.
			var alerts = [];
			var timeout = 5000; // default timeout

			var isToast = function() {
				return toast;
			};

			var clear = function() {
				alerts = [];
			};

			var get = function() {
				return alerts;
			};

			var closeAlertByIndex = function(index, thisAlerts) {
				return thisAlerts.splice(index, 1);
			};

			var closeAlert = function(id, extAlerts) {
				var thisAlerts = extAlerts ? extAlerts : alerts;
				return closeAlertByIndex(thisAlerts.map(function(e) {
					return e.id;
				}).indexOf(id), thisAlerts);
			};

			var factory = function(alertOptions) {
				var alert = {
					type: alertOptions.type,
					msg: $sce.trustAsHtml(alertOptions.msg),
					id: alertOptions.alertId,
					timeout: alertOptions.timeout,
					toast: alertOptions.toast,
					position: alertOptions.position ? alertOptions.position : 'top right',
					scoped: alertOptions.scoped,
					close: function(alerts) {
						return closeAlert(this.id, alerts);
					}
				};
				if (!alert.scoped) {
					alerts.push(alert);
				}
				return alert;
			};

			var addAlert = function(alertOptions, extAlerts) {
				alertOptions.alertId = alertId++;
				alertOptions.msg = $translate.instant(alertOptions.msg, alertOptions.params);
				var alert = factory(alertOptions);
				if (alertOptions.timeout && alertOptions.timeout > 0) {
					$timeout(function() {
						closeAlert(alertOptions.alertId, extAlerts);
					}, alertOptions.timeout);
				}
				return alert;
			};

			var success = function(msg, params, position) {
				return addAlert({
					type: 'success',
					msg: msg,
					params: params,
					timeout: timeout,
					toast: toast,
					position: position
				});
			};

			var error = function(msg, params, position) {
				return addAlert({
					type: 'danger',
					msg: msg,
					params: params,
					timeout: timeout,
					toast: toast,
					position: position
				});
			};

			var warning = function(msg, params, position) {
				return addAlert({
					type: 'warning',
					msg: msg,
					params: params,
					timeout: timeout,
					toast: toast,
					position: position
				});
			};

			var info = function(msg, params, position) {
				return addAlert({
					type: 'info',
					msg: msg,
					params: params,
					timeout: timeout,
					toast: toast,
					position: position
				});
			};

			return {
				factory: factory,
				isToast: isToast,
				add: addAlert,
				closeAlert: closeAlert,
				closeAlertByIndex: closeAlertByIndex,
				clear: clear,
				get: get,
				success: success,
				error: error,
				info: info,
				warning: warning
			};
		}];

		this.showAsToast = function(isToast) {
			toast = isToast;
		};

	});

/*jshint bitwise: false*/
'use strict';

angular.module('adama-mobile').service('Base64', function() {
	var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
	this.encode = function(input) {
		var output = '';
		var chr1, chr2, enc1, enc2, enc3;
		var chr3 = '';
		var enc4 = '';
		var i = 0;

		while (i < input.length) {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
			chr1 = chr2 = chr3 = '';
			enc1 = enc2 = enc3 = enc4 = '';
		}

		return output;
	};

	this.decode = function(input) {
		var output = '';
		var chr1, chr2, enc1, enc2, enc3;
		var chr3 = '';
		var enc4 = '';
		var i = 0;

		// remove all characters that are not A-Z, a-z, 0-9, +, /, or =
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');

		while (i < input.length) {
			enc1 = keyStr.indexOf(input.charAt(i++));
			enc2 = keyStr.indexOf(input.charAt(i++));
			enc3 = keyStr.indexOf(input.charAt(i++));
			enc4 = keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if (enc3 !== 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 !== 64) {
				output = output + String.fromCharCode(chr3);
			}

			chr1 = chr2 = chr3 = '';
			enc1 = enc2 = enc3 = enc4 = '';
		}
	};
}).factory('StorageService', ["$window", function($window) {
	return {

		get: function(key) {
			return JSON.parse($window.localStorage.getItem(key));
		},

		save: function(key, data) {
			$window.localStorage.setItem(key, JSON.stringify(data));
		},

		remove: function(key) {
			$window.localStorage.removeItem(key);
		},

		clearAll: function() {
			$window.localStorage.clear();
		}
	};
}]);

'use strict';

angular.module('adama-mobile')
	.service('ParseLinks', function() {
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
				url.replace(
					new RegExp('([^?=&]+)(=([^&]*))?', 'g'),
					function($0, $1, $2, $3) {
						queryString[$1] = $3;
					}
				);
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

'use strict';

angular.module('adama-mobile').factory('authInterceptor', ["$rootScope", "$q", "$location", "localStorageService", function($rootScope, $q, $location, localStorageService) {
	return {
		// Add authorization token to headers
		request: function(config) {
			config.headers = config.headers || {};
			var token = localStorageService.get('token');

			if (token && token.expires && token.expires > new Date().getTime()) {
				config.headers['x-auth-token'] = token.token;
			}

			return config;
		}
	};
}]).factory('authExpiredInterceptor', ["$rootScope", "$q", "$injector", "localStorageService", function($rootScope, $q, $injector, localStorageService) {
	return {
		responseError: function(response) {
			// token has expired
			if (response.status === 401 && (response.data.error === 'invalid_token' || response.data.error === 'Unauthorized')) {
				localStorageService.remove('token');
				var Principal = $injector.get('Principal');
				if (Principal.isAuthenticated()) {
					var Auth = $injector.get('Auth');
					Auth.authorize(true);
				}
			}
			return $q.reject(response);
		}
	};
}]);

'use strict';

angular.module('adama-mobile').factory('errorHandlerInterceptor', ["$q", "$rootScope", "jHipsterConstant", function($q, $rootScope, jHipsterConstant) {
	return {
		'responseError': function(response) {
			if (!(response.status === 401 && response.data.path.indexOf('/api/account') === 0)) {
				$rootScope.$emit(jHipsterConstant.appModule + '.httpError', response);
			}
			return $q.reject(response);
		}
	};
}]);

'use strict';

angular.module('adama-mobile').factory('notificationInterceptor', ["$q", "AlertService", "jHipsterConstant", function($q, AlertService, jHipsterConstant) {
	return {
		response: function(response) {
			var alertKey = response.headers('X-' + jHipsterConstant.appModule + '-alert');
			if (angular.isString(alertKey)) {
				AlertService.success(alertKey, {
					param: response.headers('X-' + jHipsterConstant.appModule + '-params')
				});
			}
			return response;
		}
	};
}]);

'use strict';

angular.module('adama-mobile')
	.factory('Auth', ["$rootScope", "$state", "$q", "$translate", "Principal", "AuthServerProvider", "Account", "Password", "PasswordResetInit", "PasswordResetFinish", function Auth($rootScope, $state, $q, $translate, Principal, AuthServerProvider, Account, Password, PasswordResetInit, PasswordResetFinish) {
		return {
			login: function(credentials, callback) {
				var cb = callback || angular.noop;
				var deferred = $q.defer();

				AuthServerProvider.login(credentials).then(function(data) {
					// retrieve the logged account information
					Principal.identity(true).then(function(account) {
						// After the login the language will be changed to
						// the language selected by the user during his registration
						$translate.use(account.langKey);
						deferred.resolve(data);
					});
					return cb();
				}).catch(function(err) {
					this.logout();
					deferred.reject(err);
					return cb(err);
				}.bind(this));

				return deferred.promise;
			},

			logout: function() {
				AuthServerProvider.logout();
				Principal.authenticate(null);
				// Reset state memory
				$rootScope.previousStateName = undefined;
				$rootScope.previousStateNameParams = undefined;
			},

			authorize: function(force) {
				return Principal.identity(force)
					.then(function() {
						var isAuthenticated = Principal.isAuthenticated();
						// an authenticated user can't access to login pages
						if (isAuthenticated && $rootScope.toState.name && $rootScope.toState.name === 'auth.signin') {
							$state.go('app.main');
						}
						if ((!$rootScope.toState.data || !$rootScope.toState.data.authorities) && !isAuthenticated) {
							// user is not signed in but desired state nneds an authenticated user
							$state.go('auth.signin');
						} else if ($rootScope.toState.data && //
							$rootScope.toState.data.authorities && //
							$rootScope.toState.data.authorities.length > 0 && //
							!Principal.hasAnyAuthority($rootScope.toState.data.authorities) //
						) {
							if (isAuthenticated) {
								// user is signed in but not authorized for desired state
								$state.go('auth.accessDenied');
							} else {
								// user is not authenticated. stow the state they wanted before you
								// send them to the signin state, so you can return them when you're done
								$rootScope.previousStateName = $rootScope.toState;
								$rootScope.previousStateNameParams = $rootScope.toStateParams;
								// now, send them to the signin state so they can log in
								$state.go('auth.signin');
							}
						}
					});
			},
			updateAccount: function(account, callback) {
				var cb = callback || angular.noop;

				return Account.save(account,
					function() {
						$rootScope.$emit('auth.updateAccount', {
							account: account
						});
						return cb(account);
					},
					function(err) {
						return cb(err);
					}.bind(this)).$promise;
			},

			changePassword: function(newPassword, callback) {
				var cb = callback || angular.noop;

				return Password.save(newPassword, function() {
					return cb();
				}, function(err) {
					return cb(err);
				}).$promise;
			},

			resetPasswordInit: function(mail, callback) {
				var cb = callback || angular.noop;

				return PasswordResetInit.save(mail, function() {
					return cb();
				}, function(err) {
					return cb(err);
				}).$promise;
			},

			resetPasswordFinish: function(keyAndPassword, callback) {
				var cb = callback || angular.noop;

				return PasswordResetFinish.save(keyAndPassword, function() {
					return cb();
				}, function(err) {
					return cb(err);
				}).$promise;
			}
		};
	}]);

'use strict';

angular.module('adama-mobile').directive('hasAnyAuthority', ['Principal', function(Principal) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			var setVisible = function() {
				element.removeClass('hidden');
			};
			var setHidden = function() {
				element.addClass('hidden');
			};
			var authorities = attrs.hasAnyAuthority.replace(/\s+/g, '').split(',');
			var defineVisibility = function(reset) {
				var result;
				if (reset) {
					setVisible();
				}

				result = Principal.hasAnyAuthority(authorities);
				if (result) {
					setVisible();
				} else {
					setHidden();
				}
			};

			if (authorities.length > 0) {
				defineVisibility(true);

				scope.$watch(function() {
					return Principal.isAuthenticated();
				}, function() {
					defineVisibility(true);
				});
			}
		}
	};
}]).directive('hasAuthority', ['Principal', function(Principal) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			var setVisible = function() {
				element.removeClass('hidden');
			};
			var setHidden = function() {
				element.addClass('hidden');
			};
			var authority = attrs.hasAuthority.replace(/\s+/g, '');
			var defineVisibility = function(reset) {

				if (reset) {
					setVisible();
				}

				Principal.hasAuthority(authority).then(function(result) {
					if (result) {
						setVisible();
					} else {
						setHidden();
					}
				});
			};

			if (authority.length > 0) {
				defineVisibility(true);

				scope.$watch(function() {
					return Principal.isAuthenticated();
				}, function() {
					defineVisibility(true);
				});
			}
		}
	};
}]);

'use strict';

angular.module('adama-mobile')
	.factory('Principal', ["$q", "Account", function Principal($q, Account) {
		var _identity;
		var _authenticated = false;

		return {
			isIdentityResolved: function() {
				return angular.isDefined(_identity);
			},
			isAuthenticated: function() {
				return _authenticated;
			},
			hasAuthority: function(authority) {
				if (!_authenticated) {
					return $q.when(false);
				}

				return this.identity().then(function(_id) {
					return _id.authorities && _id.authorities.indexOf(authority) !== -1;
				}, function() {
					return false;
				});
			},
			hasAnyAuthority: function(authorities) {
				if (!_authenticated || !_identity || !_identity.authorities) {
					return false;
				}

				for (var i = 0; i < authorities.length; i++) {
					if (_identity.authorities.indexOf(authorities[i]) !== -1) {
						return true;
					}
				}

				return false;
			},
			authenticate: function(identity) {
				_identity = identity;
				_authenticated = identity !== null;
			},
			identity: function(force) {
				var deferred = $q.defer();

				if (force === true) {
					_identity = undefined;
				}

				// check and see if we have retrieved the identity data from the
				// server.
				// if we have, reuse it by immediately resolving
				if (angular.isDefined(_identity)) {
					deferred.resolve(_identity);

					return deferred.promise;
				}

				// retrieve the identity data from the server, update the
				// identity object, and then resolve.
				Account.get().$promise
					.then(function(account) {
						_identity = account.data;
						_authenticated = true;
						deferred.resolve(_identity);
					})
					.catch(function() {
						_identity = null;
						_authenticated = false;
						deferred.resolve(_identity);
					});
				return deferred.promise;
			}
		};
	}]);

'use strict';

angular.module('adama-mobile').factory('AuthServerProvider', ["$http", "localStorageService", "Base64", "jHipsterConstant", function loginService($http, localStorageService, Base64, jHipsterConstant) {
	return {
		login: function(credentials) {
			var data = 'username=' + encodeURIComponent(credentials.username) + '&password=' + encodeURIComponent(credentials.password);
			return $http.post(jHipsterConstant.apiBase + 'api/authenticate', data, {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Accept': 'application/json'
				}
			}).success(function(response) {
				localStorageService.set('token', response);
				return response;
			});
		},
		logout: function() {
			// Stateless API : No server logout
			localStorageService.clearAll();
		},
		getToken: function() {
			return localStorageService.get('token');
		},
		hasValidToken: function() {
			var token = this.getToken();
			return token && token.expires && token.expires > new Date().getTime();
		}
	};
}]);

'use strict';

angular.module('adama-mobile')
	.factory('Account', ["$resource", "jHipsterConstant", function Account($resource, jHipsterConstant) {
		return $resource(jHipsterConstant.apiBase + 'api/account', {}, {
			'get': {
				method: 'GET',
				params: {},
				isArray: false,
				interceptor: {
					response: function(response) {
						// expose response
						return response;
					}
				}
			}
		});
	}]);

'use strict';

angular.module('adama-mobile').factory('Password', ["$resource", "jHipsterConstant", function($resource, jHipsterConstant) {
	return $resource(jHipsterConstant.apiBase + 'api/account/change_password', {}, {});
}]);

angular.module('adama-mobile').factory('PasswordResetInit', ["$resource", "jHipsterConstant", function($resource, jHipsterConstant) {
	return $resource(jHipsterConstant.apiBase + 'api/account/reset_password/init', {}, {});
}]);

angular.module('adama-mobile').factory('PasswordResetFinish', ["$resource", "jHipsterConstant", function($resource, jHipsterConstant) {
	return $resource(jHipsterConstant.apiBase + 'api/account/reset_password/finish', {}, {});
}]);

//# sourceMappingURL=adama-mobile.js.map
