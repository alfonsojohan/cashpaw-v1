// Ionic Starter App
angular.module('starter', [
  'ionic','ionic.service.core',
  'ionic.service.analytics',
  'monospaced.elastic',
  'starter.controllers',
  'starter.services',
  'ionic-datepicker',
  'ionic-timepicker',
  'toastr'
])

/**
 * Taken from: http://rubberchickin.com/how-to-hide-specific-ionic-tabs-in-angular/
 */
.directive('hideTabs', function ($rootScope) {
  return {
    restrict: 'A',
    link: function ($scope, $el) {
      $rootScope.hideTabs = true;
      $scope.$on('$destroy', function () {
        $rootScope.hideTabs = false;
      });
    }
  };
})  // eo directive hideTabs

.run(function ($ionicPlatform, $ionicAnalytics, $rootScope, $location, $state, $ionicHistory, PouchDbService) {

  $ionicPlatform.ready(function () {

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

    /* Init Db. Once its ready then only show the main screen
     * Inspired from:
     * https://www.raymondcamden.com/2014/08/16/Ionic-and-Cordovas-DeviceReady-My-Solution/
     */
    PouchDbService.init().then(function () {
      // PouchDbService.replicate();
      console.log('>>> PouchDbService.init() completed. Moving on...');
      
      // Set the next view as the root view so that the user does not see
      // the loading screen if they press the back key in android
      $ionicHistory.nextViewOptions({
        disableAnimate: true,
        disableBack: true,
        historyRoot: true
      });

      $state.go('tab.tasks', null, {
        location: 'replace'
      });

      $rootScope.$apply();
    });

  });
})  // eo run

.config(function (
  $stateProvider,
  $urlRouterProvider,
  $ionicConfigProvider,
  ionicDatePickerProvider,
  ionicTimePickerProvider,
  toastrConfig) {

  // Set the tabs to be at the bottom for all including android and ios
  $ionicConfigProvider.tabs.position('bottom');

  /**
   * Configure toastr
   */
  angular.extend(toastrConfig, {
    allowHtml: true,
    maxOpened: 2,
    closeButton: false,
    tapToDismiss: true,
    timeOut: 2000,
    positionClass: "toast-bottom-center",
  });

  // Configure date picker object
  var datePickerObj = {
    setLabel: 'Set',
    todayLabel: 'Today',
    closeLabel: 'Cancel',
    mondayFirst: true,
    inputDate: new Date(),
    // weeksList: ["S", "M", "T", "W", "T", "F", "S"],
    // monthsList: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
    templateType: 'popup',
    showTodayButton: true,
    dateFormat: 'dd MMM yyyy',
    closeOnSelect: false,
    disableWeekdays: [],
    from: new Date(2015, 8, 1)
  };
  ionicDatePickerProvider.configDatePicker(datePickerObj);

  // Configure time picker object
  var timePickerObj = {
    inputTime: (((new Date()).getHours() * 60 * 60) + ((new Date()).getMinutes() * 60)),
    format: 12,
    step: 15,
    setLabel: 'Set',
    closeLabel: 'Close'
  };
  ionicTimePickerProvider.configTimePicker(timePickerObj);

  /**
   * Setup the states and routes
   */
  $stateProvider

    .state('loading', {
      url: '/loading',
      templateUrl: 'templates/loading.html',
    })

    // setup an abstract state for the tabs directive
    .state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html'
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
    
      //TODO remove the below state for production
    .state('tab.test', {
      url: '/test',
      views: {
        'tab-test': {
          templateUrl: 'templates/test.html',
          // controller: 'TestCtrl '
        }
      }
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

    .state('tab.promo', {
      url: '/promo',
      views: {
        'tab-promo': {
          templateUrl: 'templates/tab-promo.html',
          controller: 'PromoCtrl as promoCtrl',
        },
      },
    })

    .state('tab.rewards', {
      url: '/rewards',
      views: {
        'tab-rewards': {
          templateUrl: 'templates/tab-rewards.html',
          controller: 'RewardsCtrl as rewardsCtrl',
        },
      },
    })    

    .state('tab.new-reward', {
      url: '/rewards/new',
      views: {
        'tab-rewards': {
          templateUrl: 'templates/new-reward.html',
          controller: 'RewardsCtrl as rewardsCtrl'
        }
      }
    })

    .state('tab.edit-reward', {
      url: '/rewards/:rewardId',
      views: {
        'tab-rewards': {
          templateUrl: 'templates/new-reward.html',
          controller: 'RewardsCtrl as rewardsCtrl'
        }
      }
    })

    .state('register', {
      url: '/register',
      templateUrl: 'templates/register.html',
    })

    .state('categories', {
      url: '/categories',
      templateUrl: 'templates/categories.html',
      controller: 'CategoryCtrl as categoryCtrl'
    })

  // if none of the above states are matched, use this as the fallback
  // $urlRouterProvider.otherwise('/tab/tasks');
  $urlRouterProvider.otherwise('/loading');
})  // eo config
;
