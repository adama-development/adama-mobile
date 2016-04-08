'use strict';

angular.module('adama-mobile').run(function($httpBackend, mockSettings) {
	// mock authentication
	var isLogged = mockSettings.isLoggedAtStartup;

	$httpBackend.when('POST', '/api/authenticate', function(postdata) {
		console.warn('POST /api/authenticate');
		var data = {};
		postdata.split('&').forEach(function(queryParam) {
			var couple = queryParam.split('=');
			data[couple[0]] = couple[1];
		});
		isLogged = data.username === data.password;
		return true;
	}).respond(function() {
		var timestamp = (new Date()).getTime() + 60 * 60 * 24;
		if (isLogged) {
			return [ 200, {
				token : 'admin:' + timestamp + ':d69678ead222693b38c85e81695449b9',
				expires : timestamp
			} ];
		}
		return [ 401, {
			'timestamp' : '2016-02-23T07:34:44.178+0000',
			'status' : 401,
			'error' : 'Unauthorized',
			'exception' : 'org.springframework.security.authentication.BadCredentialsException',
			'message' : 'Access Denied',
			'path' : '/api/authenticate'
		} ];
	});

	var connectedUser = mockSettings.connectedUser;

	$httpBackend.when('GET', '/api/account').respond(function() {
		if (isLogged) {
			console.warn('GET /api/account : logged');
			return [ 200, connectedUser ];
		}
		console.warn('GET /api/account : not logged');
		return [ 401, {
			error : 'Unauthorized',
			message : 'Access Denied',
			path : '/api/account',
			status : 401
		} ];
	});

	$httpBackend.when('POST', '/api/account').respond(function(method, url, data) {
		console.warn('POST /api/account', url, data);
		var postedData = JSON.parse(data);
		connectedUser = postedData;
		return [ 200, postedData ];
	});

	$httpBackend.when('POST', '/api/account/change_password').respond(function(method, url, data) {
		console.warn('POST /api/account/change_password', url, data);
		return [ 200 ];
	});

	$httpBackend.when('POST', '/api/account/reset_password/init').respond(function(method, url, data) {
		console.warn('POST /api/account/reset_password/init', data);
		if (data === 'admin@admin'){
			return [ 200, 'e-mail was sent' ];
		}
		return [ 400, 'e-mail address not registered' ];
	});
});
