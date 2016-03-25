'use strict';

angular.module('adama-mobile').run(function($httpBackend) {
	$httpBackend.whenGET(/^modules\/.*/).passThrough();
	$httpBackend.whenGET(/^adama-mobile\/.*/).passThrough();
	$httpBackend.whenGET(/^mock\/.*/).passThrough();
});
