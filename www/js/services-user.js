angular.module('starter.services')
  .factory('UserService', UserService)
  ;

/**
 * Implementation of UserService
 */
function UserService($q) {

  var _db;
  var _that = this;
  var _currentUser = null;

  this.randomPoints = function () {
    var min = 0;
    var max = 5000;

    return Math.floor(Math.random() * (max - min) + min);
  };

  var _users = [{
    _id: 'user_dad',
    name: 'Dad',
    // uid: 'dad',
    img: 'img/family/tomh.jpg',
    role: 'parent',
    points: this.randomPoints(),
    email: 'bond007@mi6.gov.uk',
  }, {
      _id: 'user_mom',
      name: 'Mummy',
      // uid: 'mummy',
      img: 'img/family/rosamundpike.jpg',
      role: 'parent',
      points: this.randomPoints(),
      email: 'mummy@gonegirl.co.uk',
    }, {
      _id: 'user_harry',
      name: 'Harry Potter',
      // uid: 'harry',
      img: 'img/family/potter.jpg',
      role: 'child',
      points: this.randomPoints(),
      email: 'harry123@hogwarts.ac.uk',
    }, {
      _id: 'user_hermione',
      name: 'Hermione Granger',
      // uid: 'hermione',
      img: 'img/family/hermione.jpg',
      role: 'child',
      points: this.randomPoints(),
      email: 'hermione@hogwarts.ac.uk',
    }];

  console.log('in UserService');

  /**
   * Set the currentUser for test purposes
   */
  _that._currentUser = _users[0];
  _that._users = _users;

  return {
    all: all,
    currentUser: currentUser,
    get: get,
    addPoints: addPoints,
    deletePoints: deletePoints
  };

  function all() {
    console.log('in UserService.all', _that._users);
    return _that._users;
  };

  function currentUser() {
    console.log('in UserService.currentUser: ', _that._currentUser);
    return _that._currentUser;
  };

  function get(id) {
    for (var i = 0; i < _that._users.length; i++) {
      if (id == _that._users[i]._id) {
        return _that._users[i];
      }
    }
  };

  function addPoints(id, points) {
    var u = this.get(id);
    u.points = u.points + points;
    return u;
  };

  function deletePoints(id, points) {
    var u = this.get(id);
    u.points = u.points - points;
    return u;
  };
}
;