(function() {
	'use strict';

	angular
		.module('myapp.hello')
		.controller('HelloController', HelloController);

	/* @ngInject */
	function HelloController($scope, $interval, c8yDevices, c8yAlarms) {
		$scope.opts = {
			center: [110.499981, 37.239226],
			zoom: 5
		};
		$scope.mapTypeOpts = {
			defaultType: 0
		};
		$scope.overOpts = {
			isOpen: false
		};
		$scope.geoOpts = {
			buttonPosition: 'LB'
		};
		$scope.geoPluginLoaded = function(plugin) {
			//			plugin.getCurrentPosition(function(status, result) {
			//				console.log('current location is :', result);
			//			});
		};

		var deviceId = 10307;
		var x1 = 121.509413;
		var y1 = 31.238912
		c8yAlarms.list({
			source: deviceId,
			pageSize: 1
		}).then(function(alarms) {
			console.log(alarms)
			firstShow();
		});
		$scope.makers = []

		function firstShow() {
			//c8yDevices.detail(deviceId).then(function(res) {
			c8yDevices.list().then(function(res) { //第一次遍历所有设备
				console.log(res)
				for(var i = 0; i < res.length; i++) {
					console.log(res[i])
					var aa = c8yDevices.parseAvailability(res[i])
					console.log(aa)
					var data = res[i].c8y_Position
					x1 = data.lat;
					y1 = data.lng;
					$scope.makers.push({ //push
						id: res[i].id,
						position: [x1, y1],
						offset: {
							x: 0,
							y: -45
						}
					})
				}

				console.log($scope.makers)
				//更新设备
				//				$interval(function(){
				//					changeDevice();
				//				},5000)
			});
		}
		$scope.pupu = function() {
			console.log($scope.makers)
		}

		function changeDevice() {
			c8yDevices.list().then(function(res) {
				for(var i = 0; i < res.length; i++) {
					var data = res[i].c8y_Position;
					x1 = data.lat;
					y1 = data.lng;
					if($scope.makers[i].id == res[i].id) {
						var x = {}
						x.position = [x1, y1];
						x.id = res[i].id;
						x.offset = {
							x: 0,
							y: -45
						};
						$scope.makers[i] = x;
					}
				}
			})
		}
		$scope.markerOpts = {
			position: [110.509413, 31.238912],
			offset: {
				x: 0,
				y: -45
			}
		};
		$scope.showWindow = function(e, marker, map) {
			new AMap.InfoWindow({
					content: '新上海国际大厦<br/>地址：浦东南路360号',
					offset: new AMap.Pixel(20, -20)
				})
				.open(map, marker.getPosition());
		};
		var vm = this;
		vm.text = 'hello, worldsssss1';
	}
}());