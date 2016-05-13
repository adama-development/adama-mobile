'use strict';

angular.module('adama-mobile').factory('pageTitle', function($rootScope, $filter) {
	var translateFn = $filter('translate');
	var api = {};

	api.set = function(pageTitleKey, data) {
		var newTitle = translateFn(pageTitleKey, data);
		$rootScope.pageTitle = newTitle;
	};

	return api;
});
