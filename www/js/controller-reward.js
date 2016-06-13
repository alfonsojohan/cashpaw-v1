angular.module('starter.controllers')

  .controller('RewardsCtrl', function (
    $scope,
    $rootScope,
    $state,
    $ionicPlatform,
    $ionicPopup,
    $stateParams,
    $ionicHistory,
    RewardService,
    ionicDatePicker,
    ionicTimePicker,
    TaskService,
    UserService,
    toastr,
    numberFilter) {

    // Keep a reference to this
    var _that = this;

    $ionicPlatform.ready(function () {
      
    });

    this.penaltyLabel = null; // Used to display the penalty pts
    this.initDone = false;
    this.headerTitle = 'New Task';
    this.task = {};
    this.originalTask = null;
    this.edit = false;
    this.chores = null;
    this.categories = [];

    /**
     * Reset current task to a known state
     */
    this.resetTask = function () {
      this.task = {
        id: null,
        duration: 0,
        name: null,
        note: null,
        points: 0,
        penalty: 0,
        dueDate: null,
        reminder: null,
        category: null,
        assignee: null,
        owner: UserService.currentUser()
      };
    };

    this.resetTask();

    this.todoStub = function () {
      $ionicPopup.alert({
        template: "Oops. This is not ready yet",
        title: 'Hang in there!'
      });
      // window.alert('Oops. This is not ready yet.');
    };

    this.new = function () {
      _that.todoStub();
    }

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

      _that.categories = TaskService.categories();
      console.log(_that.categories);

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
    }

    /**
     * Delete task
     */
    this.remove = function (task) {
      console.log('in TasksCtrl.remove ', task);
      // Chores.remove(task);
      TaskService.remove(task).then(function () {
        //XXX need to line below to refresh the ion-list. Need to find out why
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
        _that.remove(task);
        $state.go('tab.tasks', null, {
          location: 'replace'
        });
      });
    };

    /**
     * User completed task by clicking on check box
     */
    this.onCheckChange = function (task) {

      console.log('in onCheckChange.', task );

      var u = null;

      // TODO add points
      if (task.completed && task.assignee) {
        u = UserService.addPoints(task.assignee._id, task.points);
      } else {
        u = UserService.deletePoints(task.assignee._id, task.points);
      }

      toastr.info(u.name + ' has ' + numberFilter(u.points,0) + ' points', 'Hooray!');
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
      angular.copy(_that.originalTask, _that.task);

      // Go back to main tasks view and do not keep in history
      $state.go('tab.tasks', {}, {
        location: "replace"
      });
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

      if ($state.is('tab.edit-task')) {
        TaskService.update(_that.task);
      } else {
        TaskService.add(_that.task);
      }

      $state.go('tab.tasks', {}, {
        location: "replace"
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

    this.goBack = function () {
      $ionicHistory.nextViewOptions({
        disableBack: true,
        historyRoot: true
      });
      $ionicHistory.goBack();
    };

    this.selectCategory = function () {
      TaskService.currentTask = _that.task;
      $state.go('categories');
    };

    this.selectUser = function () {
      TaskService.currentTask = _that.task;
      $state.go('family');
    }

  })  // eo TasksCtrl
;