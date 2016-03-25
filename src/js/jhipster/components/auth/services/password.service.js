'use strict';

angular.module('adama-mobile').factory('Password', function($resource, jHipsterConstant) {
	return $resource(jHipsterConstant.apiBase + 'api/account/change_password', {}, {});
});

angular.module('adama-mobile').factory('PasswordResetInit', function($resource, jHipsterConstant) {
	return $resource(jHipsterConstant.apiBase + 'api/account/reset_password/init', {}, {});
});

angular.module('adama-mobile').factory('PasswordResetFinish', function($resource, jHipsterConstant) {
	return $resource(jHipsterConstant.apiBase + 'api/account/reset_password/finish', {}, {});
});
