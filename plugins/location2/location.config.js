(function() {
		'use strict';

		angular
			.module('myapp.location')
			.config(configure);

		/* @ngInject */
		function configure(c8yViewsProvider) {
			c8yViewsProvider.when('/device/:deviceId', {
				name: 'location2',
				icon: 'envelope-o',
				priority: 1000,
				templateUrl: ':::PLUGIN_PATH:::/views/location.html',
				controller: 'location'
//				showIf: ['$routeParams', 'c8yDevices', function($routeParams, c8yDevices) {
//					var deviceId = $routeParams.deviceId;
//					return c8yDevices.detailCached(deviceId).then(function(res) {
//						var device = res.data;
//						return device && (device.c8y_MotionTracking || device.c8y_Geofence);
//					});
//				}]
//			});
		});
}
}());