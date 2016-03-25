'use strict';

angular.module('adama-mobile').factory('pageTitle', function($rootScope, $filter) {
	var translateFn = $filter('translate');
	var api = {};

	api.set = function(pageTitleKey) {
		var newTitle = translateFn(pageTitleKey);
		$rootScope.pageTitle = newTitle;
	};

	return api;
});
