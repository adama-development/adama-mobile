angular.module('adamaDemoApp').component('barcodeScanner', {
	templateUrl: 'modules/barcode-scanner/barcode-scanner.html',
	controller: function($cordovaBarcodeScanner){
		var ctrl = this;
		ctrl.result = 'waiting fo a new code';
		ctrl.scan = function(){
			console.log('scan will begin');
			$cordovaBarcodeScanner.scan().then(function(data){
				if (data.cancelled){
					console.log('scan has been cancelled', data);
				} else {
					console.log('scan is done', data);
					ctrl.result = data.text;
				} 
			}, function(rejection){
				console.log('scan endded with an error', rejection);
			});
		}
	}
});

