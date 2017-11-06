(function() {
	'use strict';

	angular
		.module('myapp.customManagement')
		.controller('customManagementController', customManagementController);

	function customManagementController($scope, $uibModal, $log, $document, c8yAlert, c8yTitle, c8yDeviceGroup) {
		c8yTitle.changeTitle({
			title: '客户管理'
		});
		$scope.defdate1 = moment().format('YYYY') + '-' + moment().format('MM') + '-' + moment().format('DD')
		$scope.dateOptions1 = {
			maxDate: moment().format('YYYY-MM-DD'),
			showWeeks: false
		};
		$scope.open1 = function() {
			$scope.popup1.opened = true;
		};
		$scope.popup1 = {
			opened: false
		};
		$scope.formats1 = ['yyyy-MM-dd'];
		$scope.defdate2 = moment().format('YYYY') + '-' + moment().format('MM') + '-' + moment().format('DD')
		$scope.dateOptions2 = {
			maxDate: moment().format('YYYY-MM-DD'),
			showWeeks: false
		};
		$scope.open2 = function() {
			$scope.popup2.opened = true;
		};
		$scope.popup2 = {
			opened: false
		};
		$scope.formats2 = ['yyyy-MM-dd'];
		$scope.jugeDate = function() {
			if($scope.dt2 < $scope.dt1) {
				$scope.dt2 = undefined;
				c8yAlert.warning('结束时间应大于开始时间，请重新选择时间');
			}
		}
		c8yDeviceGroup.list().then(function(res) {
			$scope.group = res;
		});
		var $ctrl = this;
		$ctrl.animationsEnabled = true;
		$scope.newOpen = function(size, parentSelector) {
			//新建模态窗
			var parentElem = parentSelector ?
				angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
			var modalInstance = $uibModal.open({
				animation: $ctrl.animationsEnabled,
				ariaLabelledBy: 'newManagerTitle',
				ariaDescribedBy: 'newManagerBody',
				templateUrl: 'newManager.html',
				controller: 'ModalInstanceCtrl',
				controllerAs: '$ctrl',
				size: size,
				appendTo: parentElem,
				resolve: {
					items: function() {
						return $ctrl.items;
					}
				}
			});
			modalInstance.closed.then(function() {
				c8yDeviceGroup.list().then(function(res) {
					$scope.group = res;
				});
			}, function() {
				c8yDeviceGroup.list().then(function(res) {
					$scope.group = res;
				});
			});
		};
		$scope.look = function(size, parentSelector, id) {
			//详情模态窗
			var parentElem = parentSelector ?
				angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
			var modalInstance = $uibModal.open({
				animation: $ctrl.animationsEnabled,
				ariaLabelledBy: 'managerTitle',
				ariaDescribedBy: 'managerBody',
				templateUrl: 'manager.html',
				controller: 'lookmanagersCtrl',
				controllerAs: '$ctrl',
				size: size,
				appendTo: parentElem,
				resolve: {
					items: function() {
						return id;
					}
				}
			});
		};
		$scope.edit = function(size, parentSelector, id) {
			//编辑模态窗
			var parentElem = parentSelector ?
				angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
			var modalInstance = $uibModal.open({
				animation: $ctrl.animationsEnabled,
				ariaLabelledBy: 'managerTitle',
				ariaDescribedBy: 'managerBody',
				templateUrl: 'manager.html',
				controller: 'managersCtrl',
				controllerAs: '$ctrl',
				size: size,
				appendTo: parentElem,
				resolve: {
					items: function() {
						return id;
					}
				}
			});
		};
		$scope.del = function(size, parentSelector, id) {
			//删除模态窗
			var parentElem = parentSelector ?
				angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
			var modalInstance = $uibModal.open({
				animation: $ctrl.animationsEnabled,
				ariaLabelledBy: 'delTitle',
				ariaDescribedBy: 'delBody',
				templateUrl: 'del.html',
				controller: 'delCtrl',
				controllerAs: '$ctrl',
				size: size,
				appendTo: parentElem,
				resolve: {
					items: function() {
						return id;
					}
				}
			});
			modalInstance.closed.then(function() {
				c8yDeviceGroup.list().then(function(res) {
					$scope.group = res;
				});
			}, function() {
				c8yDeviceGroup.list().then(function(res) {
					$scope.group = res;
				});
			});
		};
	};
	angular.module('myapp.customManagement').controller('ModalInstanceCtrl', function($scope, $uibModalInstance, items, c8yUser, c8yDeviceGroup) {
		//新建模态窗ctrl
		var $ctrl = this;
		$ctrl.ok = function() {
			c8yUser.current()
				.then(function(currentUser) {
					var group = {
						name: $ctrl.customName,
						connection: $ctrl.connection,
						phone: $ctrl.phone,
						email: $ctrl.email,
						owner: currentUser.id,
						address: $ctrl.address,
						c8y_IsDeviceGroup: {},
						type: 'c8y_DeviceGroup'
					};
					c8yDeviceGroup.create(group).then($uibModalInstance.close());

				});
			$uibModalInstance.close();
		};
		$ctrl.cancel = function() {
			$uibModalInstance.dismiss('cancel');
		};
	});
	angular.module('myapp.customManagement').controller('delCtrl', function($scope, $uibModalInstance, items, c8yDeviceGroup, c8yAlert) {
		//删除模态窗ctrl
		var $ctrl = this;
		$ctrl.okok = function() {
			c8yDeviceGroup.detail(items).then(function(res) {
				var deviceGroup = res.data;
				if(deviceGroup.childAssets.references.length != 0) {
					c8yAlert.warning('删除失败，请先移除群组里的设备再删除群组');
					$uibModalInstance.dismiss('cancel');
					return
				}
				c8yDeviceGroup.remove(deviceGroup).then($uibModalInstance.close());
			})
			
		};
		$ctrl.cancel = function() {
			$uibModalInstance.dismiss('cancel');
		};
	});
	angular.module('myapp.customManagement').controller('managersCtrl', function($scope, $uibModalInstance, items, c8yInventory, c8yUser, c8yDeviceGroup) {
		//编辑模态窗ctrl
		var $ctrl = this;
		$ctrl.title = '编辑客户信息'
		c8yDeviceGroup.detail(items).then(function(res) {
			var data = res.data;
			$ctrl.customName = data.name;
			$ctrl.connection = data.connection;
			$ctrl.phone = data.phone;
			$ctrl.email = data.email;
			$ctrl.address = data.address;
		});
		$scope.look = false;
		$ctrl.ok = function() {
			c8yInventory.save({
				id: items,
				name: $ctrl.customName,
				connection: $ctrl.connection,
				phone: $ctrl.phone,
				email: $ctrl.email,
				address: $ctrl.address
			})
			$uibModalInstance.close();
		};
		$ctrl.cancel = function() {
			$uibModalInstance.dismiss('cancel');
		};

	});
	angular.module('myapp.customManagement').controller('lookmanagersCtrl', function($scope, $uibModalInstance, items, c8yInventory, c8yUser, c8yDeviceGroup) {
		//详情模态窗ctrl
		var $ctrl = this;
		$ctrl.title = '查看客户信息'
		c8yDeviceGroup.detail(items).then(function(res) {
			var data = res.data;
			$ctrl.customName = data.name;
			$ctrl.connection = data.connection;
			$ctrl.phone = data.phone;
			$ctrl.email = data.email;
			$ctrl.address = data.address;
		});
		$scope.look = true;
		$ctrl.cancel = function() {
			$uibModalInstance.dismiss('cancel');
		};

	});
}());