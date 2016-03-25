'use strict';

angular.module('adama-mobile').provider('language', function() {
	var languages = ['en', 'fr'];
	var selectorData = [{
		code: 'en',
		labelKey: 'FLAG_EN',
		cssCLass: 'us'
	}, {
		code: 'fr',
		labelKey: 'FLAG_FR',
		cssCLass: 'fr'
	}];

	this.setLanguages = function(newLanguages) {
		languages = newLanguages;
	};

	this.setSelectorData = function(newSelectorData) {
		selectorData = newSelectorData;
	};

	this.$get = function($q, $http, $translate) {
		var api = {};

		api.getCurrent = function() {
			var language = $translate.storage().get('NG_TRANSLATE_LANG_KEY');
			if (angular.isUndefined(language)) {
				language = 'en';
			}
			return $q.when(language);
		};

		api.getAll = function() {
			return $q.when(languages);
		};

		api.getSelectorData = function() {
			return $q.when(selectorData);
		};

		return api;
	};
});
