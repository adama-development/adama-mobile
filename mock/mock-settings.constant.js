'use strict';

angular.module('adama-mobile').constant('mockSettings', {
	isLoggedAtStartup : false,
	defaultLatencyInMs : 700,
	connectedUser : {
		'login' : 'admin',
		'password' : null,
		'firstName' : 'Vincent',
		'lastName' : 'Delacourt',
		'email' : 'vincent.delacourt@adama-development.com',
		'activated' : true,
		'langKey' : 'en',
		'authorities' : [ 'ROLE_ADMIN' ]
	},
	users : [ {
		'login' : 'user',
		'password' : null,
		'firstName' : 'User',
		'lastName' : 'Doe',
		'email' : 'user-no-reply@adama-development.com',
		'activated' : true,
		'langKey' : 'cn',
		'authorities' : [ 'ROLE_USER' ],
		'id' : 'user-0',
		'createdDate' : new Date('2016-02-18T07:34:00.997Z'),
		'lastModifiedBy' : 'admin',
		'lastModifiedDate' : new Date('2016-02-21T16:09:07.867Z'),
		'joinDate' : new Date('2016-02-21T16:09:07.867Z')
	}, {
		'login' : 'admin',
		'password' : null,
		'firstName' : 'Admin',
		'lastName' : 'Doe',
		'email' : 'admin-no-reply@adama-development.com',
		'activated' : true,
		'langKey' : 'en',
		'authorities' : [ 'ROLE_ADMIN' ],
		'id' : '56c573e9224f93a3ad32fb6c',
		'createdDate' : new Date('2016-02-18T07:34:01.004Z'),
		'lastModifiedBy' : 'admin',
		'lastModifiedDate' : new Date('2016-02-21T14:18:11.862Z'),
		'joinDate' : new Date('2016-02-21T16:09:07.867Z')
	} ]
});
