angular.module('starter.controllers')
.controller('MoneyCtrl', MoneyCtrl)
;

function MoneyCtrl(
  $state,
  $stateParams,
  UserService,
  MoneyService) {

  var _that = this;
  var _yesterday = new Date();
  _yesterday.setDate(_yesterday.getDate() - 1);

  var accounts = MoneyService.getAccounts();
  this.family = UserService.users;
  this.children = MoneyService.getChildAccounts();

  if($state.is('tab.finance')) {
      console.log('<<< MoneyCtrl: current user is: ', UserService.currentUser());
      this.account = MoneyService.getAccount('user_dad');
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

};