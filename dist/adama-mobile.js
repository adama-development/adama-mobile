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

angular.module('adama-mobile').run(["$rootScope", "$injector", "adamaConstant", function($rootScope, $injector, adamaConstant) {
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
						console.log('notification, payload', notification, payload);
						$rootScope.notification = notification;
						$rootScope.payload = payload;
						if (notification.app.asleep || notification.app.closed) {
							// $state.go('tab.push');
							console.log('application was asleep or closed');
						}
					});
				},
				onRegister: function(data) {
					console.log('Device token', data.token);
				},
				canShowAlert: false,
				canSetBadge: true,
				canPlaySound: true,
				canRunActionsOnWake: true
			});
			if ($ionicUser.current().isAuthenticated()) {
				$ionicPush.register(function(data) {
					console.log('register at startup ok', data);
				});
			} else {
				$ionicPush.unregister();
			}
		});
		$rootScope.on('principal-new', function() {
			$ionicPush.register(function(data) {
				console.log('register after signing in ok', data);
			});
		});
		$rootScope.on('principal-remove', function() {
			$ionicPush.unregister();
		});
	}
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
		controllerAs: 'ctrl',
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
		controllerAs: 'ctrl',
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

angular.module('adama-mobile').controller('SigninCtrl', ["$rootScope", "$state", "authService", "$filter", "$ionicPopup", function($rootScope, $state, authService, $filter, $ionicPopup) {
	var ctrl = this;
	ctrl.signin = function(userName, userPassword) {
		authService.login(userName, userPassword).then(function() {
			$state.go('app.main');
		}).catch(function(rejection) {
			console.error('error while signing in', rejection);
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

angular.module('adama-mobile').directive('dsPrincipalIdentity', ["$parse", "principalService", function($parse, principalService) {
	return {
		scope: false,
		link: function(scope, element, attrs) {
			principalService.getPrincipal().then(function(account) {
				$parse(attrs.data).assign(scope, account);
			});
		}
	};
}]);

'use strict';

angular.module('adama-mobile').factory('authExpiredInterceptor', ["$injector", "$q", "adamaConstant", function($injector, $q, adamaConstant) {
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

	return {
		responseError: function(response) {
			var config = response.config;
			if (response.status === 401 && config.url.indexOf(adamaConstant.apiBase) === 0) {
				return getAdamaTokenService().refreshAndGetToken().then(function() {
					return getHttpService()(config);
				});
			}
			return $q.reject(response);
		}
	};
}]);

/*jshint -W069 */
/*jscs:disable requireDotNotation*/
'use strict';

angular.module('adama-mobile').factory('authInterceptor', ["$injector", "adamaConstant", function($injector, adamaConstant) {
	var getAdamaTokenService = (function() {
		var service;
		return function() {
			return service || (service = $injector.get('adamaTokenService'));
		};
	}());

	return {
		// Add authorization token to headers
		request: function(config) {
			config.headers = config.headers || {};
			if (!config.headers['x-auth-token'] && config.url.indexOf(adamaConstant.apiBase) === 0) {
				return getAdamaTokenService().getToken().then(function(token) {
					if (token) {
						config.headers['Authorization'] = 'Bearer ' + token;
					}
					return config;
				});
			}
			return config;
		}
	};
}]);

'use strict';

// TODO still needed ?
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
			controller: ['$scope', 'adamaConstant',
				function($scope, adamaConstant) {

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

					var cleanHttpErrorListener = $rootScope.$on(adamaConstant.appModule + '.httpError', function(event, httpResponse) {
						var i;
						event.stopPropagation();
						switch (httpResponse.status) {
							// connection refused, server not reachable
							case 0:
								addErrorAlert('Server not reachable', 'error.server.not.reachable');
								break;

							case 400:
								var errorHeader = httpResponse.headers('X-' + adamaConstant.appModule + '-error');
								var entityKey = httpResponse.headers('X-' + adamaConstant.appModule + '-params');
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
										var fieldName = $translate.instant(adamaConstant.appModule + '.' + fieldError.objectName + '.' + convertedField);
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

// TODO still needed ?
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

'use strict';

angular.module('adama-mobile').factory('User', ["$resource", "adamaConstant", "adamaResourceConfig", function($resource, adamaConstant, adamaResourceConfig) {
	var config = angular.extend({}, adamaResourceConfig, {
		'delete': {
			method: 'DELETE',
			params: {
				login: '@login'
			}
		}
	});
	return $resource(adamaConstant.apiBase + 'api/users/:login', {}, config);
}]);

'use strict';

angular.module('adama-mobile').constant('adamaConstant', {
	apiBase: 'http://localhost:13337/',
	appModule: 'mySuperApp',
	adamaMobileToolkitTemplateUrl: {
		app: 'adama-mobile/app.html',
		authAccessDenied: 'adama-mobile/auth/accessDenied.html',
		authSignin: 'adama-mobile/auth/signin.html',
		authRecover: 'adama-mobile/auth/recoverPassword.html'
	},
	enableBadge: false,
	enablePush: false,
	urlResetPassword: 'path/to/reset/password?isMobile=true'
});

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

'use strict';

angular.module('adama-mobile').factory('adamaTokenService', ["$rootScope", "$http", "$q", "$state", "$ionicUser", "jwtHelper", "adamaConstant", function($rootScope, $http, $q, $state, $ionicUser, jwtHelper, adamaConstant) {
	var api = {};

	var ionicUser = $ionicUser.current();
	$rootScope.on('principal-new', function() {
		ionicUser = $ionicUser.current();
	});

	api.getToken = function() {
		console.log('getToken');
		var token;
		if (ionicUser.isAuthenticated()) {
			token = ionicUser.get('access_token');
			if (jwtHelper.isTokenExpired(token)) {
				return api.refreshAndGetToken();
			}
		}
		return $q.when(token);
	};

	api.refreshAndGetToken = function() {
		var token = ionicUser.get('access_token');
		var refreshToken = ionicUser.get('refresh_token');
		return $http({
			method: 'POST',
			url: adamaConstant.apiBase + 'api/login/refresh',
			headers: {
				'Authorization': 'Bearer ' + token
			},
			data: {
				'refresh_token': refreshToken
			}
		}).then(function(response) {
			var newToken = response.data;
			ionicUser.set('access_token', newToken);
			return ionicUser.save().then(function() {
				return newToken;
			});
		}, function(rejection) {
			console.error('error while refreshing user token, redirect to signin', rejection);
			$state.go('auth.signin');
		});
	};

	return api;
}]);

'use strict';

angular.module('adama-mobile').factory('authService', ["$http", "$ionicAuth", "adamaConstant", "principalService", function($http, $ionicAuth, adamaConstant, principalService) {
	var api = {};

	api.login = function(username, password) {
		console.log('login', username);
		var authOptions = {
			remember: true
		};
		var data = {
			username: username,
			password: password
		};
		return $ionicAuth.login('custom', authOptions, data).then(function() {
			console.log('login is ok, ask custom auth server to refresh the user data');
			return $http({
				method: 'POST',
				url: adamaConstant.apiBase + 'externalLogin/refreshUserExternal',
				data: {
					externalId: username
				}
			});
		}).then(function() {
			console.log('refreshing custom auth server is ok, ask ionic for the updateduser info');
			// get the new user information from ionic
			return principalService.resetPrincipal();
		});
	};

	api.logout = function() {
		console.log('logout');
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
				url: adamaConstant.apiBase + 'api/files',
				data: {
					idList: idList
				}
			}).then(function(response) {
				angular.forEach(workingList, function(binaryFile) {
					binaryFile.url = response.data[binaryFile.id];
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

angular.module('adama-mobile').factory('principalService', ["$rootScope", "$q", "$http", "$resource", "$ionicUser", "adamaConstant", function($rootScope, $q, $http, $resource, $ionicUser, adamaConstant) {
	var api = {};
	var principalPromise = $q.reject('not init');
	var isAuthenticated = false;
	var accountResource = $resource(adamaConstant.apiBase + 'api/account', {}, {});
	var passwordResource = $resource(adamaConstant.apiBase + 'api/account/change_password', {}, {});
	var passwordResetInitResource = $resource(adamaConstant.apiBase + 'api/account/reset_password/init', {}, {});

	api.resetPrincipal = function() {
		isAuthenticated = false;
		var ionicUser = $ionicUser.current();
		if (ionicUser.isAuthenticated()) {
			principalPromise = $http({
				method: 'GET',
				url: adamaConstant.apiBase + 'api/users/byLogin/' + ionicUser['external_id']
			}).then(function(response) {
				var principal = response.data;
				isAuthenticated = true;
				$rootScope.$broadcast('principal-new', {
					principal: principal
				});
				return principal;
			});
		} else {
			principalPromise = $q.reject('not logged');
		}
		return principalPromise;
	};

	api.getPrincipal = function() {
		return principalPromise;
	};

	api.deletePrincipal = function() {
		isAuthenticated = false;
		principalPromise = $q.reject('not logged');
		$rootScope.$broadcast('principal-remove');
	};

	api.authorize = function() {
		console.log('authorize');
	};

	api.hasAnyAuthority = function(authorities) {
		console.log('hasAnyAuthority', authorities);
		// TODO
		return true;
	};

	api.resetPasswordInit = function(mail) {
		console.log('resetPasswordInit', mail);
		return passwordResetInitResource.save({
			mail: mail,
			urlResetPassword: adamaConstant.urlResetPassword
		}).$promise;
	};

	api.updateAccount = function(principal) {
		console.log('updateAccount', principal);
		return accountResource.save(principal, function() {
			$rootScope.$emit('principal-update', {
				principal: principal
			});
			principalPromise = $q.when(principal);
		}).$promise;
	};

	api.changePassword = function(newPassword) {
		console.log('changePassword');
		return passwordResource.save({
			password: newPassword
		}).$promise;
	};

	return api;
}]);

//# sourceMappingURL=adama-mobile.js.map
