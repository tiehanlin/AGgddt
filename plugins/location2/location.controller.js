(function() {
	'use strict';

	angular
		.module('myapp.location')
		.controller('location', ['$scope', '$routeParams', 'c8yDevices', 'c8yEvents', "c8yRealtime", "c8yMeasurements", 'c8yGeo', 'c8yAlert', function($scope, $routeParams, c8yDevices, c8yEvents, c8yRealtime, c8yMeasurements, c8yGeo, c8yAlert) {
			var deviceId = $routeParams.deviceId;
			$scope.opts = {
				center: [110.499981, 37.239226],
				zoom: 12
			};
			$scope.makers = [];
			$scope.location = {};
			$scope.centerMap = function() {
				$scope.opts = {
					center: [$scope.location.lng, $scope.location.lat],
					zoom: 12
				}
			}
			c8yEvents.list({
				source: $routeParams.deviceId,
				type: 'c8y_LocationUpdate',
				pageSize: 1
			}).then(function(res) {
				//$scope.device = res[0];
				console.log(res)
				if(res.length == 0) {
					c8yDevices.detail(deviceId).then(function(result) {
						$scope.location.lng = result.data.c8y_Position.lng;
						$scope.location.lat = result.data.c8y_Position.lat;
						$scope.location.alt = result.data.c8y_Position.alt;
						var obj = {
							position: [$scope.location.lng, $scope.location.lat],
							offset: {
								x: 0,
								y: -45
							}
						}
						$scope.opts = {
							center: [$scope.location.lng, $scope.location.lat],
							zoom: 12
						};
						$scope.makers[0] = obj;
					})
				} else {
					$scope.location.lng = res[0].c8y_Position.lng;
					$scope.location.lat = res[0].c8y_Position.lat;
					$scope.location.alt = res[0].c8y_Position.alt;
					var obj = {
						position: [$scope.location.lng, $scope.location.lat],
						offset: {
							x: 0,
							y: -45
						}
					}
					$scope.opts = {
						center: [$scope.location.lng, $scope.location.lat],
						zoom: 12
					};
					$scope.makers[0] = obj;
				}·
			});
			$scope.save = function() {
				c8yDevices.detail(deviceId).then(function(res) {
					var device = res.data;
					if(device.c8y_Position == undefined) {
						device.c8y_Position = {}
					}
					device.c8y_Position.lng = $scope.location.lng;
					device.c8y_Position.lat = $scope.location.lat;
					device.c8y_Position.alt = $scope.location.alt;
					return device;
				}).then(c8yDevices.update);
			}
			$scope.search = function() {
				c8yGeo.geoCode($scope.location.address).then(function(res) {
					if(res.data.length > 0) {
						var position = res.data[0];
						$scope.location.lng = position.lon;
						$scope.location.lat = position.lat;
						var obj = {
							position: [$scope.location.lng, $scope.location.lat],
							offset: {
								x: 0,
								y: -45
							}
						}
						$scope.makers[0] = obj;
						$scope.opts = {
							center: [$scope.location.lng, $scope.location.lat],
							zoom: 12
						}
					}
				});
			}
			$scope.text = 'location';

			var eventsChannel = '/events/' + deviceId;
			var scopeId = $scope.$id;

			function startRealtime() {
				c8yRealtime.start(scopeId, eventsChannel);
			}

			function setUpListeners() {
				c8yRealtime.addListener(scopeId, eventsChannel, 'CREATE', onCreateEvent);
				c8yRealtime.addListener(scopeId, eventsChannel, 'DELETE', onDeleteEvent);
			}

			function stopRealtime() {
				c8yRealtime.stop(scopeId, eventsChannel);
			}

			function onCreateEvent(action, eventObject) {
				var lng = eventObject.c8y_Position.lng;
				var lat = eventObject.c8y_Position.lat;
				var lnglat = [lng, lat];
				$scope.location.alt = eventObject.c8y_Position.alt;
				AMap.convertFrom(lnglat, 'gps', function(status, result) {
					console.log(result)
					$scope.location.lng = result.locations[0].M;
					$scope.location.lat = result.locations[0].O;
					var obj = {
						position: [$scope.location.lng, $scope.location.lat],
						offset: {
							x: 0,
							y: -45
						}
					}
					$scope.opts = {
						center: [$scope.location.lng, $scope.location.lat],
						zoom: 12
					}
					$scope.makers[0] = obj;
				})
			}

			function onDeleteEvent(action, eventObjectId) {
				_.remove($scope.events, function(evt) {
					return evt.id === eventObjectId;
				});

				c8yAlert.info('Event with id ' + eventObjectId + ' has been deleted.');
			}
			$scope.events = [];
			$scope.$on('$destroy', stopRealtime);
			var real = 0;
			$scope.realTime = function() {
				real++;
				if(real == 1) {
					setUpListeners();
					startRealtime();
				}
				if(real == 2) {
					stopRealtime();
					real = 0;
				}
				//c8yRealtime.switchRealtime(scopeId, eventsChannel);
			}

		}])
}());