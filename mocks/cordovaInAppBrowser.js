'use strict';

(function(window) {
	console.log('decorating cordovaInAppBrowser ...');
	window.cordova = window.cordova || {};
	window.cordova.InAppBrowser = {
		open : function(){
			console.warn('InAppBrowser.open');
		},
		close : function(){
			console.warn('InAppBrowser.close');
		},
		show : function(){
			console.warn('InAppBrowser.show');
		},
		executeScript : function(){
			console.warn('InAppBrowser.executeScript');
		},
		insertCSS : function(){
			console.warn('InAppBrowser.insertCSS');
		}
	}
}(window));
