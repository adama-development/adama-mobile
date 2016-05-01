'use strict';

angular.module('adama-mobile').config(function($stateProvider, adamaConstant) {
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
});
