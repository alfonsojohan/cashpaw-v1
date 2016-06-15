angular.module('starter.controllers', [])

.controller('DashCtrl', function (
  UserService,
  toastr) {

  var _that = this;
  var deploy = new Ionic.Deploy();

  this.uid = null;
  this.pwd = null;

  // this.hasUpdate = false;
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

  /**
   *  Check Ionic Deploy for new code
   */
  this.checkUpdates = function () {

    console.log('DashCtrl.checkUpdates');
    toastr.info('Checking for updates...');

    deploy.check().then(
      function (hasUpdate) {

        console.log('Ionic Deploy: Update available: ' + hasUpdate);
        // _that.hasUpdate = hasUpdate;

        if (!hasUpdate) {
          toastr.info('Congratulations. You have the latest update.');
        } else {
          toastr.info('Downloading update...');
          _that.doUpdate();
        };

      }, 
      function (err) {
        toastr.error('Failed to check for updates: ', err);
        console.error('Ionic Deploy: Unable to check for updates', err);
      });
  }; // eo checkUpdates

})  // eo DashCtrl

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

.controller('PromoCtrl', function () {

  console.log('In PromoCtrl');
})
;