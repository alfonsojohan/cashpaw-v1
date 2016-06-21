angular.module('starter.services')
.service('UserService', UserService)
;

/**
 * Implementation of UserService
 */
function UserService(
  $q, 
  $ionicModal,
  $state,
  PouchDbService) {

  var _that = this;
  var _deferred = null; 
  var _db = PouchDbService.db();

  // console.log('>>> in UserService. db: ', _db);

  /**
   * Function to generate random number of points for each dummy user
   */
  var randomPoints = function () {
    var min = 0;
    var max = 5000;
    return Math.floor(Math.random() * (max - min) + min);
  };

  /**
   * Static array of dummy users
   */
  this.users = [{
    _id: 'user_dad',
    name: 'Dad',
    img: 'img/family/tomh.jpg',
    role: 'parent',
    points: randomPoints(),
    email: 'bond007@mi6.gov.uk',
  }, {
    _id: 'user_mom',
    name: 'Mummy',
    img: 'img/family/rosamundpike.jpg',
    role: 'parent',
    points: randomPoints(),
    email: 'mummy@gonegirl.co.uk',
  }, {
    _id: 'user_harry',
    name: 'Harry Potter',
    img: 'img/family/potter.jpg',
    role: 'child',
    points: randomPoints(),
    email: 'harry123@hogwarts.ac.uk',
  }, {
    _id: 'user_hermione',
    name: 'Hermione Granger',
    img: 'img/family/hermione.jpg',
    role: 'child',
    points: randomPoints(),
    email: 'hermione@hogwarts.ac.uk',
  }];

/**
 * Setup the ionicModal element for choosing a user
 */
  function setupChooser() {
    $ionicModal.fromTemplateUrl('templates/family-list.html', {
      scope: null,
      animation: 'slide-in-up'
    }).then(function (modal) {
      _that.modal = modal;
    });    
  };

  if (!_that.modal) {
    setupChooser();
  }

  /**
   * Set the currentUser for test purposes
   */
  this.user = this.users[0];

  this.all = function() {
    // console.log('in UserService.all', _that.users);
    return _that.users;
  };

  this.currentUser = function() {
    // console.log('<<< UserService.currentUser');
    // console.log('in UserService.currentUser: ', _that.user);
    return _that.user;
  };

  this.setCurrentUser = function (id) {
    var usr = _that.get(id);
    if(usr) {
      _that.user = usr;
    }
    return usr;
  }

  this.choose = function () {
    _deferred = $q.defer();
    _that.modal.show();
    return _deferred.promise;
  }

  this.endChoose = function (user) {
    _that.modal.hide();
    _deferred.resolve([user]);
  }

  this.get = function (id) {
    for (var i = 0; i < _that.users.length; i++) {
      if (id == _that.users[i]._id) {
        return _that.users[i];
      }
    }
  };

  this.addPoints = function (id, points) {
    var u = _that.get(id);
    u.points = u.points + points;
    return u;
  };

  this.deletePoints = function (id, points) {
    var u = _that.get(id);
    u.points = u.points - points;
    return u;
  };
}
;