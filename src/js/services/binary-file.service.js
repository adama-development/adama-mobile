'use strict';

angular.module('adama-mobile').factory('binaryFileService', function($http, $q, adamaConstant) {
	var api = {};

	api.initUrlForBinaryFiles = function(binaryFileList) {
		var workingList = [];
		var idList = [];
		angular.forEach(binaryFileList, function(binaryFile) {
			if (binaryFile && binaryFile.id && !binaryFile.url) {
				workingList.push(binaryFile);
				idList.push(binaryFile.id);
			}
		});
		if (idList.length) {
			return $http({
				method: 'PUT',
				url: adamaConstant.apiBase + 'files',
				data: angular.toJson(idList)
			}).then(function(response) {
				angular.forEach(workingList, function(binaryFile) {
					binaryFile.url = response.data.urlList[binaryFile.id];
				});
			});
		}
		return $q.when();
	};

	return api;
});
