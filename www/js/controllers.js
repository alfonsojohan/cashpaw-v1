angular.module('starter.controllers', [])
  
  .controller('AuthCtrl', function () {
  
    console.log('in AuthCtrl');
    
      
  })
  
  .controller('DashCtrl', function ($scope, $state) {
    
    this.uid = null;
    this.pwd = null;
    
    /**
     * Facebook Login test
     */
    this.fbLogin = function () {
     $state.go('register');
    };
    
    this.register = function () {
      console.log('uid: ', this.uid, 'pwd:', this.pwd);
      
      var details = {
        'email': this.uid,
        'password': this.pwd
      };
      
      Ionic.Auth.signup(details).then({
        function() {
          window.alert('sucess');
        },
        function () {
          window.alert('fail');
        }
      });
    };
    
   })

  .controller('TasksCtrl', function ($scope, $state, $stateParams, $ionicHistory, Chats, Chores) {

    console.log('in TasksCtrl', $stateParams);

    this.headerTitle = 'New Task';
    this.task = {};
    this.originalTask = null;
    this.edit = false;

    this.labels = {
      duration: 'How long?',
      points: 0,
      category: 'Nothing here...'
    };

    this.chores = null;
    
    this.task = {
      category: "Nothing here yet...",
      categoryImg: "img/smiley-flat.png",
      duration: 0,
      id: null,
      img: "img/smiley-flat.png",
      name: null,
      note: null,
      points: 0,
    };

    if ($state.is('tab.tasks')) {
      //  this.chats = Chats.all();
      this.chores = Chores.all();

    } else if ($state.is('tab.new-task')) {

    } else if ($state.is('tab.edit-task')) {

      this.edit = true;
      this.headerTitle = 'Edit Task';

      /**
       * Operate on a copy of the object until the user clicks on save
       */
      this.task = Chores.get($stateParams.taskId);
      this.originalTask = angular.copy(this.task);

      // this.labels.points = this.task.points;
      // this.labels.duration = this.task.duration + ' mins';
      // this.labels.category = this.task.category;

      // this.task = Chats.get($stateParams.chatId);
      // this.originalTask = angular.copy(this.task);
    }

    this.remove = function (chat) {
      console.log('in TasksCtrl.remove');
      Chores.remove(chat);
    };

    this.removeFromDetailView = function (task) {
      console.log('in TasksCtrl.removeFromDetailView');

      this.remove(task);

      $state.go('tab.tasks', null, {
        location: 'replace'
      });
    };

    this.onCheckChange = function (id) {
      console.log('in onCheckChange. Id: ', id);
    };

    this.newTask = function () {
      console.log('in TasksCtrl.newTask');

      $state.go('tab.new-task');
    };

    this.cancel = function () {

      // Restore the task object
      angular.copy(this.originalTask, this.task);

      // Go back to main tasks view and do not keep in history
      $state.go('tab.tasks', {}, {
        location: "replace"
      });
    };

    this.saveTask = function () {
      console.log('in NewTaskCtrl.saveTask');

      $state.go('tab.tasks', {}, {
        location: "replace"
      });
    };
  })

  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })

  ;