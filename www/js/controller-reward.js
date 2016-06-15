angular.module('starter.controllers')

.controller('RewardsCtrl', function (
  $state,
  $stateParams,
  $ionicPopup,
  RewardService,
  UserService,
  UtilityService,
  toastr,
  numberFilter) {

  // Keep a reference to this
  var _that = this;

  // Scope properties
  this.rewards = [];
  this.reward = null;
  this.original = null;
  this.headerTitle = 'New Reward';
  this.edit = false;

  /**
   * Selects the user to assign the reward to
   */
  this.selectUser = function () {
    UserService.choose().then(function (result){
      console.log('RewardsCtrl.selectUser complete', result);

      // User cancelled selection
      if (!angular.isObject(result[0])) {
        return;
      }
      _that.reward.assignee = result[0];
    });
  };

  /**
   * Reset current reward to a known state
   */
  this.resetReward = function () {
    this.reward = {
      id: null,
      name: null,
      note: null,
      points: 0,
      assignee: null,
      owner: UserService.currentUser()
    };
  };

  /**
   * Set the initial processing of the controller based on the ui state
   */
  if ($state.is('tab.rewards')) {
    
    RewardService.all().then(function (result) {
      _that.rewards = result;
    });

  } else if ($state.is('tab.new-reward')) {

    _that.edit = false;
    _that.headerTitle = 'New Reward';
    _that.resetReward();

  } else if ($state.is('tab.edit-reward')) {

    _that.edit = true;
    _that.headerTitle = 'Edit Reward';

    /**
     * Operate on a copy of the object until the user clicks on save
     */
    RewardService.get($stateParams.rewardId).then(function (data) {
      _that.reward = data;
      _that.original = angular.copy(data);
    });
  };

  // TODO Remove for production
  this.todoStub = function () {
    UtilityService.todo();
  };

  /**
   * Cancel new / edit reward 
   */
  this.cancel = function () {
    // Restore the reward object if editing
    if (_that.edit) {
      angular.copy(_that.original, _that.reward);
    };
    UtilityService.goBack();
  };

  /**
   * Function to validate a reward. 
   * Return boolean true if validation passed
   */
  function validate(reward) {

    console.log('RewardsCtrl validate');

    var result = {
      valid: false,
      error: null
    };

    if ((!angular.isString(reward.name)) || (0 == reward.name.length)) {
      result.error = 'You need a name for the reward';
      return result;
    }

    result.valid = true;
    return result;
  };

  /**
   * Save new / edited reward
   */
  this.save = function () {

    console.log('RewardsCtrl.save');

    // var result = {valid: true}; //_that.validatereward(_that.reward);
    var result = validate(_that.reward);

    if (!result.valid) {
      toastr.error(result.error);
      return;
    };

    var fn = (_that.edit ? RewardService.update : RewardService.add);
    fn(_that.reward).then(function () {
      $state.go('tab.rewards');
    });
  };
  
  /**
   * Delete reward. We need to reload the state so that the list is
   * updated
   */
  this.remove = function (reward) {
    console.log('in RewardsCtrl.remove ', reward);
    RewardService.remove(reward).then(function () {
      $state.reload();
    });
  };

  /**
   * Delete reward from new-reward view
   */
  this.removeFromDetailView = function (reward) {
    console.log('RewardsCtrl.removeFromDetailView', reward);

    $ionicPopup.confirm({
      title: 'Delete Reward',
      template: 'Are you sure you want to delete the reward ' + reward.name + '?'
    }).then(function (res) {
      if (!res) {
        return true;
      };

      RewardService.remove(reward).then(function () {
        $state.go('tab.rewards');
      });
    });
  };

  /**
   * User completed reward by clicking on check box
   */
  this.onCheckChange = function (reward) {

    console.log('in onCheckChange.', reward);

    var u = null;

    if (!angular.isObject(reward.assignee)) {
      return;
    }

    // TODO add points
    if (reward.completed && reward.assignee) {
      u = UserService.addPoints(reward.assignee._id, reward.points);
    } else {
      u = UserService.deletePoints(reward.assignee._id, reward.points);
    }

    toastr.info(u.name + ' has ' + numberFilter(u.points, 0) + ' points', 'Hooray!');
  };

  /**
   * Display reward details when user click on the list item
   */
  this.view = function (reward) {
    $state.go('tab.edit-reward', {
      rewardId: reward._id
    });  
  };

  /**
   * Assign the number of points needed to claim the reward
   */
  this.assignPoints = function () {

    $ionicPopup.prompt({
      title: 'Assign Points',
      template: 'How many points to enjoy this?',
      inputType: 'tel',
      inputPlaceholder: 'Points',
      defaultText: '0'
    }).then(function (val) {

      val = parseInt(val);
      if (isNaN(val)) {
        return;
      }

      if (val < 0) {
        toastr.error('Oops. You cannot assign anything less than zero');
      };

      _that.reward.points = val;
    });
  };

})  // eo RewardsCtrl
;