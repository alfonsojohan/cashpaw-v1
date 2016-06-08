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

  var _users = [{
    _id: 'user_dad',
    name: 'Dad',
    uid: 'dad',
    img: 'img/family/tomh.jpg',
    role: 'parent'
  }, {
    _id: 'user_mom',
    name: 'Mummy',
    uid: 'mummy',
    img: 'img/family/rosamundpike.jpg',
    role: 'parent'
  }, {
    _id: 'user_harry',
    name: 'Harry',
    uid: 'harry',
    img: 'img/family/potter.jpg',
    role: 'child'
  }, {
    _id: 'user_hermione',
    name: 'Hermione',
    uid: 'hermione',
    img: 'img/family/hermione.jpg',
    role: 'child'
  }];

  console.log('in UserService');

  /**
   * Set the currentUser for test purposes
   */
  _that._currentUser = _users[0];
  _that._users = _users;

  return {
    all: all,
    currentUser: currentUser
  };

  function all() {
    console.log('in UserService.all', _that._users);
    return _that._users;
  };

  function currentUser() {
    console.log('in UserService.currentUser: ', _that._currentUser);
    return _that._currentUser;
  };
}
;