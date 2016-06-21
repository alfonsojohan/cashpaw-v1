angular.module('starter.controllers')
.controller('MoneyCtrl', MoneyCtrl)
;

function MoneyCtrl() {

  var _that = this;
  var _yesterday = new Date();
  _yesterday.setDate(_yesterday.getDate() - 1);

  this.balance = Math.random() * (500 - 100) + 100;
  this.total = 0.0;
  this.transactions = [{
    title: 'Debit Card Purchase',
    description: 'Chatime',
    amount: -12.55,
    currency: 'MYR',
    type: 'debit',
    time: _yesterday.setHours(15,30)
  }, {
    title: 'Debit Card Purchase',
    description: 'TGV Cinema',
    amount: -24.00,
    currency: 'MYR',
    type: 'debit',
    time: _yesterday.setHours(15,50)
  }, {
    title: 'Withdrawal',
    description: 'ATM SCR01',
    amount: -50.00 ,
    currency: 'MYR',
    type: 'debit',
    time: _yesterday.setHours(18,30)
  }, {
    title: 'Cashpaw Reward',
    description: 'From Mummy',
    amount: 150.00 ,
    currency: 'MYR',
    type: 'credit',
    time: _yesterday.setHours(18,40)
  }, {
    title: 'Debit Card Purchase',
    description: "McDonald's Bandar Utama",
    amount: -16.35 ,
    currency: 'MYR',
    type: 'debit',
    time: _yesterday.setHours(15,30)
  }];

  for (var i = 0; i < this.transactions.length; i++) {
    _that.total += this.transactions[i].amount;
  }
};