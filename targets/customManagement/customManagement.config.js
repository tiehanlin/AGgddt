(function () {
  'use strict';

  angular
    .module('myapp.customManagement')
    .config(configure);

  /* @ngInject */
  function configure(
    c8yNavigatorProvider,
    c8yViewsProvider
  ) {
    c8yNavigatorProvider.addNavigation({ // adds a menu item to the navigator with ...
      name: 'customManagement', // ... the name *"customManagement"*
      icon: 'cube', // ... the cube icon (icons are provided by the great Font Awesome library and you can use any of their [icon names](http://fontawesome.io/icons/) without the *fa-* prefix here
      priority: 100000, // ... a priority of 100000, which means that all menu items with a priority lower than 100000 appear before this menu item and all with a priority higher than 100000 appear after this menu item
      path: 'customManagement' // ... */customManagement* as path
    });

    c8yViewsProvider.when('/customManagement', { // when the path "/customManagement" is accessed ...
      templateUrl: ':::PLUGIN_PATH:::/views/customManagement.html', //  ... display our html file "customManagement.html" inside the "views" folder of our plugin (the plugin's folder is represented using the magic string ```:::PLUGIN_PATH:::```, which is replaced by the actual path during the build process)
      controller: 'customManagementController', // ... use "customManagementController" as controller
      controllerAs: '$ctrl'
    });
  }
}());
