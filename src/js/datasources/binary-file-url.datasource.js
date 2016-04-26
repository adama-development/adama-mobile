'use strict';

angular.module('adama-mobile').directive('dsBinaryFileUrl', function($parse, binaryFileService) {
	return {
		scope: false,
		link: function(scope, element, attrs) {
			var updateOutput = function(binaryFileList) {
				if (attrs.output) {
					binaryFileList = angular.copy(binaryFileList);
				}
				if (!angular.isArray(binaryFileList)) {
					binaryFileList = [binaryFileList];
				}
				binaryFileService.initUrlForBinaryFiles(binaryFileList);
				if (attrs.output) {
					$parse(attrs.output).assign(scope, binaryFileList);
				}
			};
			scope.$watch(attrs.input, function() {
				var binaryFileList = $parse(attrs.input)(scope);
				if (binaryFileList) {
					updateOutput(binaryFileList);
				}
			});
		}
	};
});
