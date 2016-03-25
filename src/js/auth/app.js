'use strict';

angular.module('adama-mobile').config(function($stateProvider, jHipsterConstant) {
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
});

angular.module('adama-mobile').config(function($translateProvider) {
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
});
