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
	enablePush: false
});
