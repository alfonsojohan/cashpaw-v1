angular.module('starter.controllers')

.controller('TasksCtrl', function (
  $state,
  $ionicPopup,
  $stateParams,
  $rootScope,
  $scope,
  ionicDatePicker,
  ionicTimePicker,
  TaskService,
  UserService,
  UtilityService,
  toastr,
  numberFilter) {

  // Keep a reference to this
  var _that = this;

  console.log('<<< TasksCtrl load. ', _that);

  // Setup the properites
  this.headerTitle = 'New Task';
  this.task = null;
  this.tasks = [];
  this.originalTask = null;
  this.edit = false;
  this.categories = [];

  /**
   * For the child tasks we need to track the view enter event
   * to refresh the child's tasks.
   */
  $scope.$on('$ionicView.enter', function () {
    if (!$state.is('child.tasks')) {
      return;
    }
    console.log('>>> TasksCtrl -> $ionicView.enter')
    TaskService.userTasks(UserService.currentUser())
    .then(function (result) {
      _that.tasks = result;
    });  
  });

  /**
   * Reset current task to a known state
   */
  this.resetTask = function () {
    this.task = {
      _id: null,
      duration: 0,
      name: null,
      note: null,
      points: 0,
      penalty: 0,
      dueDate: undefined,
      reminder: undefined,
      category: null,
      assignee: null,
      owner: UserService.currentUser()
    };
  };

  this.resetTask();

  this.todoStub = function () {
    UtilityService.todo();
  };

  /**
   * Set the initial processing of the controller based on the ui state
   */
  if ($state.is('tab.tasks')) {

    TaskService.all().then(function (result) {
      _that.tasks = result;
    });

  } else if ($state.is('tab.new-task')) {

    _that.edit = false;
    _that.headerTitle = 'New Task';
    _that.categories = TaskService.categories();

  } else if ($state.is('tab.edit-task')) {

    _that.edit = true;
    _that.headerTitle = 'Edit Task';
    _that.categories = TaskService.categories();

    /**
     * Operate on a copy of the object until the user clicks on save
     */
    TaskService.get($stateParams.taskId).then(function (data) {
      _that.task = data;
      _that.originalTask = angular.copy(data);

      // Update the penaltyLabel
      _that.penaltyLabel = (0 == _that.task.penalty ? 'Nothing here...' : _that.task.penalty + ' pts');
    });

  } else if ($state.is('categories')) {
    _that.categories = TaskService.categories();
    console.log('in category state', _that.categories);
  } else if ($state.is('child.view-task')) {
    TaskService.get($stateParams.taskId).then(function (data) {
      _that.task = data;
    });
  }

  /**
   * Delete task
   */
  this.remove = function (task) {
    console.log('in TasksCtrl.remove ', task);
    TaskService.remove(task).then(function () {
      $state.reload();
    });
  };

  /**
   * Delete task from new-task view
   */
  this.removeFromDetailView = function (task) {
    console.log('in TasksCtrl.removeFromDetailView');

    $ionicPopup.confirm({
      title: 'Delete Task',
      template: 'Are you sure you want to delete the task ' + task.name + '?'
    }).then(function (res) {

      if (!res) {
        return true;
      };

      TaskService.remove(task).then(function () {
        $state.go('tab.tasks');
      });
    });
  };

  /**
   * User completed task by clicking on check box
   */
  this.onCheckChange = function (task) {

    console.log('in onCheckChange.', task);

    var u = null;
    var fn = (task.completed ? UserService.addPoints : UserService.deletePoints);

    // TODO add points
    if (task.assignee) {
      TaskService.update(task).then(function () {
        u = fn(task.assignee._id, task.points);
        toastr.info(u.name + ' has ' + numberFilter(u.points, 0) + ' points', 'Hooray!');
      });
    }

  };

  /**
   * Display task details when user click on the list item
   */
  this.viewTask = function (task) {
    if ($state.is('child.tasks')) {
      $state.go('child.view-task', {
        taskId: task._id
      });
    } else {
      $state.go('tab.edit-task', {
        taskId: task._id
      });
    }
  };

  /**
   * Cancel new / edit task 
   */
  this.cancel = function () {

    // Restore the task object
    if (_that.edit) {
      angular.copy(_that.originalTask, _that.task);
    };

    // Go back to main tasks view and do not keep in history
    $state.go('tab.tasks');
  };

  /**
   * Save new / edited task
   */
  this.saveTask = function () {

    var result = _that.validateTask(_that.task);

    if (!result.valid) {
      window.alert(result.error);
      return;
    };

    var fn = (_that.edit ? TaskService.update : TaskService.add);
    fn(_that.task).then(function () {
      $state.go('tab.tasks');
    });
  };

  /**
   * Method to validate a task. 
   * Return boolean true if validation passed
   */
  this.validateTask = function (task) {

    var result = {
      valid: false,
      error: null
    };

    if (!angular.isString(task.name)) {
      result.error = 'TODO: Show error';
      return result;
    }

    if (0 == task.name.length) {
      result.error = 'TODO: Show error';
      return result;
    }

    result.valid = true;
    return result;
  };

  /**
   * Show date selector for due date and reminder
   * and update the button text to show the date.
   * Uses https://github.com/rajeshwarpatlolla/ionic-datepicker
   */
  this.selectDate = function (model) {

    console.log('in selectDate', model);

    var onDateSelect = function (d) {
      console.log('Return value from the datepicker popup is : ' + d, new Date(d));

      switch (model) {
        case 'due-date':
          _that.task.dueDate = new Date(d).toDateString();
          break;
      };
    };

    var conf = {
      callback: onDateSelect,
      mondayFirst: true,
      from: new Date(),
      to: new Date(2018, 11, 31), // the Month is 0 based!
    };

    ionicDatePicker.openDatePicker(conf);
  };

  /**
   * Show the time selector
   */
  this.selectTime = function (model) {

    console.log('in TaskCtrl.selectTime', model);

    var onSelect = function (d) {

      var selectedTime = null;

      if (typeof (d) === 'undefined') {
        return;
      } else {
        selectedTime = new Date(d * 1000);
      };

      switch (model) {
        case 'reminder':
          _that.task.reminder = selectedTime.getUTCHours() + ':' + selectedTime.getUTCMinutes();
          break;
      };
    };

    var conf = {
      callback: onSelect,
    };

    ionicTimePicker.openTimePicker(conf);
  };

  this.numberInput = function (model) {

    var title, template, placeholder, defaultVal;

    switch (model) {
      case 'points':
        title = 'Assign Points';
        template = 'How many points is this task?';
        placeholder = 'Points';
        defaultVal = _that.task.points || '';
        break;
      case 'penalty':
        title = 'Penalty Points';
        template = 'How many points to deduct?';
        placeholder = 'Penalty';
        defaultVal = _that.task.penalty || '';
        break;
      case 'duration':
        title = 'How Long?';
        template = 'How many minutes should this take to finish?';
        placeholder = 'Minutes';
        defaultVal = _that.task.duration || '';
        break;
    };

    $ionicPopup.prompt({
      title: title,
      template: template,
      inputType: 'tel',
      inputPlaceholder: placeholder,
      defaultText: defaultVal
    }).then(function (num) {

      num = parseInt(num);

      if (isNaN(num)) {
        return;
      }

      if (num < 0) {
        window.alert('Oops. You cannot assign anything less than zero');
        return;
      }

      switch (model) {
        case 'points':
          _that.task.points = num;
          break;
        case 'duration':
          _that.task.duration = num;
          break;
        case 'penalty':
          _that.task.penalty = num;
          _that.penaltyLabel = (0 == num ? 'Nothing here...' : num + ' pts');
          break;
      };

    });
  };

  this.selectCategory = function () {
    TaskService.currentTask = _that.task;
    $state.go('categories');
  };

  this.selectUser = function () {
    UserService.choose().then(function (result){
      console.log('TaskCtrl.selectUser complete', result);

      // User cancelled selection
      if (!angular.isObject(result[0])) {
        return;
      }
      _that.task.assignee = result[0];
    });
  };

})  // eo TasksCtrl
;