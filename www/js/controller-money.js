angular.module('starter.controllers')
.controller('MoneyCtrl', MoneyCtrl)
;

function MoneyCtrl(
  $scope,
  $state,
  $location,
  $stateParams,
  $ionicPopup,
  $ionicLoading,
  $timeout,
  $filter,
  UserService,
  MoneyService) {

  var _that = this;
  var _yesterday = new Date();
  _yesterday.setDate(_yesterday.getDate() - 1);

  var accounts = MoneyService.getAccounts();
  this.family = UserService.users;
  // this.children = MoneyService.getChildAccounts();

  /**
   * For the child tasks we need to track the view enter event
   * to refresh the child's tasks.
   */
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    if ($state.is("tab.finance")) {
      _that.children = MoneyService.getChildAccounts();
	    console.log("State changed: ", toState, _that.children);
    }
  });

  if($state.is('tab.finance')) {
      console.log('<<< MoneyCtrl: current user is: ', UserService.currentUser());
      this.account = MoneyService.getAccount('user_dad');
      // this.children = MoneyService.getChildAccounts();
  } else if($state.is('child.finance')) {
      console.log('<<< MoneyCtrl: current user is: ', UserService.currentUser());
      this.account = MoneyService.getAccount('user_hermione');      
  } else if ($state.is('tab.finance-details')) {
    this.child = MoneyService.getAccount($stateParams.userId);
    this.child.owner = UserService.get($stateParams.userId);
    // this.transactions = .transactions;
    console.log('transactions ', this.transactions);
  }

  this.showDetails = function (child) {
    console.log('showDetails', child);
    // _that.userTransactions = child.transactions;
    $state.go('tab.finance-details', {
      userId: child._id
    });
  }

  this.selectUser = function () {
    UserService.choose().then(function (result){
      console.log('MoneyCtrl.selectUser complete', result);

      // User cancelled selection
      if (!angular.isObject(result[0])) {
        return;
      }
      // _that.task.assignee = result[0];
    });
  };

  this.doTransfer = function (child, amount) {

    console.log('<<< moneyCtrl.doTransfer', child, amount);

    if (amount === -1) {

      $ionicPopup.prompt({
        title: 'Cashpaw Quick Transfer',
        template: 'How much do you want to transfer?',
        inputType: 'tel',
        inputPlaceholder: 'RM',
        defaultText: '50'
      }).then(function (num) {

        num = parseInt(num);

        if (isNaN(num)) {
          return;
        }

        if (num < 10) {
          window.alert('Oops. You need to transfer at least RM10');
          return;
        }

        _that.doTransfer(child, num);
      });

      return;
    };

    var msg = '<div>Amount: ' + amount + '</div>' +
        '<div>To: ' + child.owner.name + '</div>';

    $ionicPopup.confirm({
      title: 'Confirm Quick Money Transfer',
      template: msg
    }).then(function (result) {

      if (!result) {
        return true;
      }

      $ionicLoading.show({
        template: 'Contacting bank for transfer. Please wait...'
      }).then(function () {
        
        $timeout(function(){

          $ionicLoading.hide();
          
          try {
            var nb = MoneyService.doTransfer('user_dad', child.owner._id, amount);
            $ionicPopup.alert({
              title: 'Transfer Successful',
              template: child.owner.name + ' new bank balance is ' + $filter('number')(nb, 2)
            });
          } catch (e) {
            $ionicPopup.alert({
              title: 'Oops...',
              template: e
            });
          }

        }, 1000);

      })
    })

  };
};