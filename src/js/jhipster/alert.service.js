'use strict';

// TODO still needed ?
angular.module('adama-mobile')
	.provider('AlertService', function() {
		var toast = false;

		this.$get = ['$timeout', '$sce', '$translate', function($timeout, $sce, $translate) {

			var alertId = 0; // unique id for each alert. Starts from 0.
			var alerts = [];
			var timeout = 5000; // default timeout

			var isToast = function() {
				return toast;
			};

			var clear = function() {
				alerts = [];
			};

			var get = function() {
				return alerts;
			};

			var closeAlertByIndex = function(index, thisAlerts) {
				return thisAlerts.splice(index, 1);
			};

			var closeAlert = function(id, extAlerts) {
				var thisAlerts = extAlerts ? extAlerts : alerts;
				return closeAlertByIndex(thisAlerts.map(function(e) {
					return e.id;
				}).indexOf(id), thisAlerts);
			};

			var factory = function(alertOptions) {
				var alert = {
					type: alertOptions.type,
					msg: $sce.trustAsHtml(alertOptions.msg),
					id: alertOptions.alertId,
					timeout: alertOptions.timeout,
					toast: alertOptions.toast,
					position: alertOptions.position ? alertOptions.position : 'top right',
					scoped: alertOptions.scoped,
					close: function(alerts) {
						return closeAlert(this.id, alerts);
					}
				};
				if (!alert.scoped) {
					alerts.push(alert);
				}
				return alert;
			};

			var addAlert = function(alertOptions, extAlerts) {
				alertOptions.alertId = alertId++;
				alertOptions.msg = $translate.instant(alertOptions.msg, alertOptions.params);
				var alert = factory(alertOptions);
				if (alertOptions.timeout && alertOptions.timeout > 0) {
					$timeout(function() {
						closeAlert(alertOptions.alertId, extAlerts);
					}, alertOptions.timeout);
				}
				return alert;
			};

			var success = function(msg, params, position) {
				return addAlert({
					type: 'success',
					msg: msg,
					params: params,
					timeout: timeout,
					toast: toast,
					position: position
				});
			};

			var error = function(msg, params, position) {
				return addAlert({
					type: 'danger',
					msg: msg,
					params: params,
					timeout: timeout,
					toast: toast,
					position: position
				});
			};

			var warning = function(msg, params, position) {
				return addAlert({
					type: 'warning',
					msg: msg,
					params: params,
					timeout: timeout,
					toast: toast,
					position: position
				});
			};

			var info = function(msg, params, position) {
				return addAlert({
					type: 'info',
					msg: msg,
					params: params,
					timeout: timeout,
					toast: toast,
					position: position
				});
			};

			return {
				factory: factory,
				isToast: isToast,
				add: addAlert,
				closeAlert: closeAlert,
				closeAlertByIndex: closeAlertByIndex,
				clear: clear,
				get: get,
				success: success,
				error: error,
				info: info,
				warning: warning
			};
		}];

		this.showAsToast = function(isToast) {
			toast = isToast;
		};

	});
