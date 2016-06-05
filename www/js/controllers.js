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

    };

  })

  .controller('TasksCtrl', function (
    $scope,
    $state,
    $ionicPlatform,
    $stateParams,
    $ionicHistory,
    ionicDatePicker,
    Chores,
    TaskService) {

    // Keep a reference to this
    var _that = this;

    this.initDone = false;
    this.headerTitle = 'New Task';
    this.task = {};
    this.originalTask = null;
    this.edit = false;

    // this.labels = {
    //   duration: 'How long?',
    //   points: 0,
    //   category: 'Nothing here...'
    // };

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


    /**
     * Set the initial processing of the controller based on the ui state
     */
    if ($state.is('tab.tasks')) {
      $ionicPlatform.ready(function () {

        if (!_that.initDone) {
          console.log('in TaskService.$ionicPlatform.ready');

          try {
            TaskService.initDb();
            TaskService.all().then(function (result) {
              _that.chores = result;
            });
          } catch (e) {
            console.error(e);
          };
          _that.initDone = true;
        }
      });

    } else if ($state.is('tab.new-task')) {

    } else if ($state.is('tab.edit-task')) {

      this.edit = true;
      this.headerTitle = 'Edit Task';

      /**
       * Operate on a copy of the object until the user clicks on save
       */
      this.task = Chores.get($stateParams.taskId);
      // this.task = TaskService.get($stateParams.taskId);
      this.originalTask = angular.copy(this.task);

      TaskService.get($stateParams.taskId).then(function (data) {
        console.log('apuuu');
        _that.task = data;
        this.originalTask = angular.copy(data);
      });
    }

    /**
     * Delete task
     */
    this.remove = function (task) {
      console.log('in TasksCtrl.remove ', task);
      Chores.remove(task);
      TaskService.remove(task).then(function () {
        $state.reload();
      });
    };

    /**
     * Delete task from new-task view
     */
    this.removeFromDetailView = function (task) {
      console.log('in TasksCtrl.removeFromDetailView');

      this.remove(task);

      $state.go('tab.tasks', null, {
        location: 'replace'
      });
    };

    /**
     * User completed task by clicking on check box
     */
    this.onCheckChange = function (id) {
      console.log('in onCheckChange. Id: ', id);
    };

    /**
     * Display task details when user click on the list item
     */
    this.viewTask = function (task) {
      TaskService.get(task._id).then(function () {
        $state.go('tab.edit-task', {
          taskId: task._id
        });
      });
    };

    /**
     * Create new task button action
     */
    this.newTask = function () {
      console.log('in TasksCtrl.newTask');
      $state.go('tab.new-task');
    };

    /**
     * Cancel new / edit task 
     */
    this.cancel = function () {

      // Restore the task object
      angular.copy(this.originalTask, this.task);

      // Go back to main tasks view and do not keep in history
      $state.go('tab.tasks', {}, {
        location: "replace"
      });
    };

    /**
     * Save new / edited task
     */
    this.saveTask = function () {
      console.log('in NewTaskCtrl.saveTask');

      TaskService.add(this.task);

      $state.go('tab.tasks', {}, {
        location: "replace"
      });
    };

    /**
     * Show date selector
     */
    this.selectDate = function (model) {

      console.log('in selectDate');

      var ipObj1 = {
        callback: function (val) {  //Mandatory
          console.log('Return value from the datepicker popup is : ' + val, new Date(val));
        },
        from: new Date(), //Optional
        to: new Date(2018, 1, 1), //Optional
        inputDate: new Date(),      //Optional
        mondayFirst: true,          //Optional
        //disableWeekdays: [0],       //Optional
        closeOnSelect: true,       //Optional
        templateType: 'popup'       //Optiona
      };

      ionicDatePicker.openDatePicker(ipObj1);
    }
  })

  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })

  ;