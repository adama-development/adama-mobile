'use strict';

angular.module('adama-mobile').decorator('$ionicUser', function($delegate, $q, mockSettings) {
	console.log('decorating $ionicUser ...');
	var isAuthenticated = mockSettings.isLoggedAtStartup;

	$delegate.current = function() {
		console.log('decorated $ionicUser.current');
		return {
			external_id: 'loginFromAdamaApi',
			isAuthenticated: function(){
				console.warn('$ionicUser.current isAuthenticated');
				return isAuthenticated;
			},
			get: function(key){
				console.warn('$ionicUser.current get', key);
				return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlNwb25nZSBCb2IifQ.s0TgonAwWEuJcLiidUDscCnPga5b4-xkM35fAuK5_KE';
			}
		};
	};

	return $delegate;
});
