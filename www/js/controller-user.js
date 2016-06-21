angular.module('starter.controllers')
.controller('UserCtrl', function (
  UserService) {

  var _that = this;

  // console.log('in UserCtrl');

  _that.users = UserService.all();

  this.goBack = function () {
    // UtilityService.goBack();
    UserService.endChoose(null);
  };

  this.cancel = function () {
    UserService.endChoose(null);
  };
  
  this.select = function (user) {
    UserService.endChoose(user);
  };

})
;