angular.module('starter.controllers', [])

  .controller('AuthCtrl', function () {
    console.log('in AuthCtrl');
  })

  .controller('DashCtrl', function (
    $scope,
    $state,
    $ionicPlatform,
    UserService,
    TaskService,
    PouchDbService) {

    var _that = this;
    var deploy = new Ionic.Deploy();

    this.uid = null;
    this.pwd = null;

    this.hasUpdate = false;
    this.updateText = "Check Updates";
    this.updateProgress = "";

    this.currentUser = UserService.currentUser();
    this.family = UserService.all();

    // Update app code with new release from Ionic Deploy
    this.doUpdate = function () {
      console.log('in DashCtrl.doUpdate');
      deploy.update().then(function (res) {
        console.log('Ionic Deploy: Update Success! ', res);
        window.alert('Update successful. App will restart now.');
        _that.updateProgress = "";
      }, function (err) {
        console.log('Ionic Deploy: Update error! ', err);
      }, function (prog) {
        console.log('Ionic Deploy: Progress... ', prog);
        _that.updateProgress = "Downloading... " + prog + '%';
        try {
          $scope.$apply();
        } catch (e) {
          //do nothing
        };
      });
    };

    // Check Ionic Deploy for new code
    this.checkForUpdates = function () {
      console.log('Ionic Deploy: Checking for updates');
      _that.updateProgress ='Contacting update server...';
      deploy.check().then(function (hasUpdate) {
        console.log('Ionic Deploy: Update available: ' + hasUpdate);
        _that.hasUpdate = hasUpdate;

        if (!hasUpdate) {
          window.alert('Congratulations. You have the latest update.');
          _that.updateProgress = "";
        } else {
          _that.updateProgress = "Updating...";
          $scope.$apply();
          _that.doUpdate();
        };
      }, function (err) {
        console.error('Ionic Deploy: Unable to check for updates', err);
        window.alert('Failed to get updated: ' + err);
      });
    }
  })

  .controller('CategoryCtrl', function ($scope, $ionicHistory, TaskService) {

    var _that = this;

    _that.categories = TaskService.categories();

    this.selectCategory = function (category) {
      TaskService.currentTask.category = category;
      $ionicHistory.goBack();
    };

    this.goBack = function () {
      $ionicHistory.nextViewOptions({
        disableBack: true,
        historyRoot: true
      });
      $ionicHistory.goBack();
    };

  })

  .controller('UserCtrl', function (
    $ionicHistory,
    UserService,
    TaskService) {

    var _that = this;

    console.log('in UserCtrl');

    _that.users = UserService.all();

    this.goBack = function () {
      $ionicHistory.nextViewOptions({
        disableBack: true,
        historyRoot: true
      });
      $ionicHistory.goBack();
    };

    this.select = function (user) {
      try {
        TaskService.currentTask.assignee = user;
      } catch (e) {
        console.error(e);
      }
      $ionicHistory.goBack();
    };

  })

  .controller('RewardsCtrl', function () {
    
  })
  ;