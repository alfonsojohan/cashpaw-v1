// Ionic Starter App

angular.module('starter', ['ionic','ionic.service.core', 'ionic.service.analytics', 'monospaced.elastic', 'starter.controllers', 'starter.services'])

/**
 * Taken from: http://rubberchickin.com/how-to-hide-specific-ionic-tabs-in-angular/
 */
.directive('hideTabs', function($rootScope) {
    return {
        restrict: 'A',
        link: function($scope, $el) {
            $rootScope.hideTabs = true;
            $scope.$on('$destroy', function() {
                $rootScope.hideTabs = false;
            });
        }
    };
})

.run(function($ionicPlatform, $ionicAnalytics) {
  $ionicPlatform.ready(function() {
    
    // Register analytics
    $ionicAnalytics.register();
    
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  
  // Set the tabs to be at the bottom for all including android and ios
  $ionicConfigProvider.tabs.position('bottom');
  
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:
  .state('tab.tasks', {
    url: '/tasks',
    views: {
      'tab-tasks': {
        templateUrl: 'templates/tab-tasks.html',
        controller: 'TasksCtrl as taskCtrl'
      }
    }
  })
  
  .state('tab.new-task', {
    url: '/tasks/new',
    views: {
      'tab-tasks': {
        templateUrl: 'templates/new-task.html',
        controller: 'TasksCtrl as taskCtrl'
      }
    } 
  })
  
  .state('tab.edit-task', {
    url: '/tasks/:taskId',
    views: {
      'tab-tasks': {
        templateUrl: 'templates/new-task.html',
        controller: 'TasksCtrl as taskCtrl'
      }
    } 
  })
  
  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl as dashCtrl'
      }
    }
  })
  ;  

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/tasks');

});
