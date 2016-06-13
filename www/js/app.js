// Ionic Starter App

angular.module('starter', [
  'ionic',
  'ionic.service.core',
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
  })

  .run(function ($ionicPlatform, $ionicAnalytics, PouchDbService) {
    $ionicPlatform.ready(function () {

      // Register analytics
      $ionicAnalytics.register();

      // Init Db and start the replication 
      PouchDbService.init();
      PouchDbService.replicate();

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

      // setup an abstract state for the tabs directive
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
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

      .state('tab.dash', {
        url: '/dash',
        views: {
          'tab-dash': {
            templateUrl: 'templates/tab-dash.html',
            controller: 'DashCtrl as dashCtrl'
          }
        }
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

      .state('register', {
        url: '/register',
        templateUrl: 'templates/register.html',
      })

      .state('categories', {
        url: '/categories',
        templateUrl: 'templates/categories.html',
        controller: 'CategoryCtrl as categoryCtrl'
      })

      .state('family', {
        url: '/family',
        templateUrl: 'templates/family.html',
        controller: 'UserCtrl as userCtrl'
      })

      ;

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/tasks');

  });
