(function() {
  'use strict';

  angular
    .module('myapp.deviceEventsRealTime')
    .config(configure);

  /* @ngInject */
  function configure(c8yViewsProvider) {

    c8yViewsProvider.when('/device/:deviceId', {
      name: 'Real-Time Events',
      icon: 'rss',
      templateUrl: ':::PLUGIN_PATH:::/views/deviceEventsRealTime.html',
      controller: 'deviceEventsRealTimeCtrl'
    });

  }

}());