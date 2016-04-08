'use strict';

angular.module('adama-mobile').run(function($httpBackend, $http, jHipsterConstant, mockSettings) {
	var entities = mockSettings.users;

	$httpBackend.when('GET', '/api/users').respond(function() {
		console.warn('GET /api/users (PDF mass export)');
		var request = new XMLHttpRequest();
		request.open('GET', 'mock/pdf/users.pdf', false);
		request.send(null);
		return [ request.status, request.response, {} ];
	});

	$httpBackend.when('GET', /^\/api\/users\?.*/).respond(function(method, url) {
		console.warn('GET /api/users (JSON list)', url);
		return [ 200, entities, {
			'Link' : '</api/users?page=0&size=20>; rel="last",</api/users?page=0&size=20>; rel="first"',
			'X-Total-Count' : 35
		} ];
	});

	var getById = function(id) {
		var entity;
		angular.forEach(entities, function(e) {
			if (id === e.login) {
				entity = e;
			}
		});
		return entity;
	};

	var getByEmail = function(email) {
		var entity;
		angular.forEach(entities, function(e) {
			if (email === e.email) {
				entity = e;
			}
		});
		return entity;
	};

	$httpBackend.when('GET', /^\/api\/users\/.*/).respond(function(method, url) {
		console.warn('GET /api/users/xx', url);
		var id = url.substring('/api/users/'.length);
		var entity = getById(id);
		if (entity) {
			return [ 200, entity ];
		}
		return [ 404 ];
	});

	$httpBackend.when('DELETE', /^\/api\/users\/.*/).respond(function(method, url) {
		console.warn('DELETE /api/users/xx', url);
		var id = url.substring('/api/users/'.length);
		var entity = getById(id);
		if (entity) {
			entities.splice(entities.indexOf(entity), 1);
		}
		return [ 200 ];
	});

	$httpBackend.when('PUT', '/api/users').respond(function(method, url, data) {
		console.warn('PUT /api/users', url, data);
		var postedData = JSON.parse(data);
		var id = postedData.login;
		var entity = getById(id);
		if (entity) {
			entities[entities.indexOf(entity)] = postedData;
		} else {
			entities.push(postedData);
		}
		return [ 200, postedData ];
	});

	$httpBackend.when('POST', '/api/users').respond(function(method, url, data, headers) {
		console.warn('POST /api/users (new user)', url, data);
		var postedData = JSON.parse(data);
		var id = postedData.login;
		var entity = getById(id);
		if (entity) {
			console.error('error.userexists');
			headers['X-' + jHipsterConstant.appModule + '-Error'] = 'error.userexists';
			headers['X-' + jHipsterConstant.appModule + '-Params'] = 'user-management';
			return [ 400, undefined, headers ];
		}
		entity = getByEmail(postedData.email);
		if (entity) {
			console.error('error.emailexists');
			headers['X-' + jHipsterConstant.appModule + '-Error'] = 'error.emailexists';
			headers['X-' + jHipsterConstant.appModule + '-Params'] = 'user-management';
			return [ 400, undefined, headers ];
		}
		entities.push(postedData);
		return [ 200, postedData ];
	});

	$httpBackend.when('POST', '/api/users?method=import-xls').respond(function(method, url, data) {
		console.warn('POST /api/users (import-xls)', data);
		return [ 200 ];
	});
});
