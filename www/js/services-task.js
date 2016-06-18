angular.module('starter.services')

.service('TaskService', TaskService)
;

/**
 * Implementation of TaskService
 */
function TaskService(
  $q,
  $rootScope,
  POUCH_CONSTANTS,
  PouchDbService) {

  var _db = PouchDbService.db();
  var _tasks = null;
  var _that = this;

  _that.currentTask = null;

  /**
   * Add a new task to the db
   */
  this.add = function (task) {
    // task._id = generateTaskId(task);
    task._id = PouchDbService.newId(POUCH_CONSTANTS.DOC_TYPES.TASK, task);
    console.log('in TaskService.addTask. Task: ', task);
    return $q.when(_db.put(task));
  };

  /**
   * Updates an existing task in the db
   */
  this.update = function (task) {
    console.log('in TaskService.updateTask', task);
    return $q.when(_db.put(task));
  };

  /**
   * Delete an existing task from the db
   */
  this.remove = function (task) {
    console.log('in TaskService.deleteTask. Task:', task);
    return $q.when(_db.remove(task._id, task._rev));
  };

  /**
   * Retrieve the task info based on the task _id from the db
   */
  this.get = function (taskId) {
    console.log('in TaskService.getTask _id: ', taskId);
    return $q.when(_db.get(taskId));
  };

  /**
   * Find tasks belonging to a specific user
   */
  this.userTasks = function (user) {
    
    var mapFn = function (doc) {
      if (0 == doc._id.indexOf('task_')) {
        if (doc.assignee) {
          emit(doc.assignee._id);
        }
      }
    };

    return $q.when(_db.query(mapFn, {
      key: user._id,
      include_docs: true
    }).then(function (result) {

      // Normalize the results before returning it
      var a = [];
      for(var i = 0; i < result.rows.length; i++) {
        a.push(result.rows[i].doc);
      }
      return a;
    }));
  };

  /**
   * Get all tasks
   */
  this.all = function () {

    console.log('in TaskService.all');

    if (!_tasks) {
      return $q.when(_db.allDocs({ 
        include_docs: true, 
        startkey:  POUCH_CONSTANTS.DOC_TYPES.TASK,
        endkey: POUCH_CONSTANTS.DOC_TYPES.TASK + POUCH_CONSTANTS.WILDCARD, 
      }))
        .then(function (docs) {
          _tasks = docs.rows.map(function (row) {
            row.doc.Date = new Date(row.doc.Date);
            return row.doc;
          });

          // Listen for changes on the database.
          _db.changes({
            live: true,
            since: 'now',
            include_docs: true
          })
            .on('change', function (change) {
              onDatabaseChange(change)
            });
          console.log('TaskService.all: Tasks list: ', _tasks);
          return _tasks;
        })
    } else {
      return $q.when(_task);
    };
  };

  function onDatabaseChange(change) {

    console.log('in TaskService.onDatabaseChange. Change: ', change);

    if (-1 == change.id.indexOf(POUCH_CONSTANTS.DOC_TYPES.TASK)) {
      return;
    };
   var index = PouchDbService.findIndex(_tasks, change.id);
    var task = _tasks[index];


    if (change.deleted) {
      if (task) {
        _tasks.splice(index, 1); // delete
      }
    } else {
      if (task && task._id === change.id) {
        _tasks[index] = change.doc; // update
      } else {
        _tasks.splice(index, 0, change.doc) // insert
      }
    }
  };

  /**
   * Dummy function to return a fixed list of categories
   */
  this.categories= function () {

    console.log('in TaskService.getCategories()');
    
    return [{
      label: 'Cleaning',
      img: 'img/categories/broom.png',
      creator: {
        name: 'system'
      },
    }, {
      label: 'Stuff',
      img: 'img/categories/price-tag.png',
      creator: {
        name: 'system'
      },
    }];
  };

};