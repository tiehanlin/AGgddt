(function () {
  'use strict';

  angular
    .module('myapp.hello')
    .config(configure);

  /* @ngInject */
  function configure(
  	mapScriptServiceProvider,
    c8yNavigatorProvider,
    c8yViewsProvider
  ) {
  	mapScriptServiceProvider.setKey('ed25c10805b3c399473f8308feb7e63c');
    c8yNavigatorProvider.addNavigation({ // adds a menu item to the navigator with ...
      name: 'hello', // ... the name *"hello"*
      icon: 'cube', // ... the cube icon (icons are provided by the great Font Awesome library and you can use any of their [icon names](http://fontawesome.io/icons/) without the *fa-* prefix here
      priority: 100000, // ... a priority of 100000, which means that all menu items with a priority lower than 100000 appear before this menu item and all with a priority higher than 100000 appear after this menu item
      path: 'hello' // ... */hello* as path
    });
    c8yViewsProvider.when('/hello', { // when the path "/hello" is accessed ...
      templateUrl: ':::PLUGIN_PATH:::/views/hello.html', //  ... display our html file "hello.html" inside the "views" folder of our plugin (the plugin's folder is represented using the magic string ```:::PLUGIN_PATH:::```, which is replaced by the actual path during the build process)
      controller: 'HelloController', // ... use "HelloController" as controller
      controllerAs: 'vm'
    });
  }
}());
