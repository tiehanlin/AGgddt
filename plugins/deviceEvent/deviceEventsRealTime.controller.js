(function() {
  'use strict';

  angular
    .module('myapp.deviceEventsRealTime')
    .controller('deviceEventsRealTimeCtrl', DeviceEventsRealTimeController);

  /* @ngInject */
  function DeviceEventsRealTimeController($scope, $routeParams, c8yRealtime, c8yAlert) {
    var deviceId = $routeParams.deviceId;
    var eventsChannel = '/events/' + deviceId;
    var SCOPE_ID = $scope.$id;

    function startRealtime() {
      c8yRealtime.start(SCOPE_ID, eventsChannel);
    }

    function setUpListeners() {
      c8yRealtime.addListener(SCOPE_ID, eventsChannel, 'CREATE', onCreateEvent);
      c8yRealtime.addListener(SCOPE_ID, eventsChannel, 'DELETE', onDeleteEvent);
    }

    function stopRealtime() {
      c8yRealtime.stop(SCOPE_ID, eventsChannel);
    }

    function onCreateEvent(action, eventObject) {
      $scope.events.push(eventObject);
    }

    function onDeleteEvent(action, eventObjectId) {
      _.remove($scope.events, function (evt) {
        return evt.id === eventObjectId;
      });

      c8yAlert.info('Event with id ' + eventObjectId + ' has been deleted.' );
    }

    $scope.events = [];
    $scope.$on('$destroy', stopRealtime);

    setUpListeners();
    startRealtime();
  }

}());