angular.module('starter.services')
.service('MoneyService', MoneyService)
;

function MoneyService(
  UserService) {

  var _that = this;
  var _yesterday = new Date();
  _yesterday.setDate(_yesterday.getDate() - 1);

  var transactions = [{
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
    time: _yesterday.setHours(19,15)
  }];

  var accounts = [{
    accountNo: 'xxxx xxx 8888',
    balance: 0,
    total: 0,
    transactions: transactions,
    owner: {
      _id: 'user_hermione',
      role: 'child'
    }
  }, {
    accountNo: 'xxxx xxx 9999',
    balance: 0,
    total: 0,
    transactions: transactions,
    owner: {
      _id: 'user_harry',
      role: 'child'
    }
  }, {
    accountNo: 'xxxx xxx 0007',
    balance: 0,
    total: 0,
    transactions: null,
    owner: {
      _id: 'user_dad',
      role: 'parent'
    }
  }];

  var dadTransactions = [{
    title: 'Withdrawal',
    description: 'ATM SCR01',
    amount: -50.00 ,
    currency: 'MYR',
    type: 'debit',
    time: _yesterday.setHours(18,30)
  }, {
    title: 'Quick Transfer',
    description: 'To Harry Potter',
    amount: -100.00 ,
    currency: 'MYR',
    type: 'debit',
    time: _yesterday.setHours(18,40)
  }, {
    title: 'Debit Card Payment',
    description: "Sushi ZanMai",
    amount: -386.55 ,
    currency: 'MYR',
    type: 'debit',
    time: _yesterday.setHours(15,30)
  }];

  var accounts = [{
    accountNo: 'xxxx xxx 8888',
    balance: 0,
    total: 0,
    transactions: transactions,
    owner: {
      _id: 'user_hermione',
      role: 'child'
    }
  }, {
    accountNo: 'xxxx xxx 9999',
    balance: 0,
    total: 0,
    transactions: transactions,
    owner: {
      _id: 'user_harry',
      role: 'child'
    }
  }, {
    accountNo: 'xxxx xxx 0007',
    balance: 0,
    total: 0,
    transactions: dadTransactions,
    owner: {
      _id: 'user_dad',
      role: 'parent'
    }
 }, {
    accountNo: 'xxxx xxx 1111',
    balance: 0,
    total: 0,
    transactions: [],
    owner: {
      _id: 'user_mom',
      role: 'parent'
    }  }];  

  this.family = UserService.users;
  this.children = [];

  /**
   * Generate random balance and also the transactions 
   */
  accounts.forEach(function(acc) {
    acc.balance = randomBalance();
  }, this);

  this.getAccount = function(id) {
    for(var i = 0; i < accounts.length; i++) {
      if (id == accounts[i].owner._id) {
        return accounts[i];
      }
    };
    return false;
  };
  
  /**
   * Update the owner data and also update the children array
   */
  this.family.forEach(function(el) {
    if (false !== (acc = _that.getAccount(el._id))) {
      acc.owner = el;
    } 
  }, this);  

  function randomBalance (min, max) {
    min = min || 100;
    max = max || 500;
    return Math.random() * (max - min) + min;
  }

  this.getAccounts = function () {
    return accounts;
  };

  this.getChildAccounts = function () {
    
    _that.children = [];
    this.family.forEach(function(el) {

      // if child account push to the children array
      if('child' == el.role) {
        for(i = 0; i < accounts.length; i++) {
          if(accounts[i].owner._id == el._id) {
            el.balance = accounts[i].balance; 
            break;         
          }
        }
        _that.children.push(el);
      }
    });

    return _that.children;
  }

  this.doTransfer = function (fromAcc, toAcc, amount) {
    console.log('MoneyService.doTransfer', fromAcc, toAcc, amount);

    /**
     * Get source account and check for funds
     */
    var srcAcc = this.getAccount(fromAcc);
    var dest = this.getAccount(toAcc);

    if (srcAcc.balance < amount) {
      throw 'Insufficient funds for transfer';
    }

    srcAcc.balance -= amount;
    srcAcc.transactions.push({
      title: 'Quick Transfer',
      description: 'To ' + dest.owner.name,
      amount: -amount ,
      currency: 'MYR',
      type: 'debit',
      time: new Date()
    });

    dest.balance += amount;
    dest.transactions.push({
      title: 'Cashpaw Reward',
      description: 'From ' + srcAcc.owner.name,
      amount: amount,
      currency: 'MYR',
      type: 'credit',
      time: new Date()
    });

    return dest.balance;
  }
};