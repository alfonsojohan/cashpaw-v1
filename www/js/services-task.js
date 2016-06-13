angular.module('starter.services')

.service('TaskService', TaskService)
;

/**
 * Implementation of TaskService
 */
function TaskService(
  $q,
  POUCH_CONSTANTS,
  PouchDbService) {

  var _db = PouchDbService.db();
  var _tasks = null;
  var _that = this;

  _that.currentTask = null;

  console.log('in TaskService');

  return {
    all: all,
    add: addTask,
    update: updateTask,
    remove: deleteTask,
    get: getTask,
    categories: getCategories,
  };

  /**
   * Add a new task to the db
   */
  function addTask(task) {
    // task._id = generateTaskId(task);
    task._id = PouchDbService.newId(POUCH_CONSTANTS.DOC_TYPES.TASK, task);
    console.log('in TaskService.addTask. Task: ', task);
    return $q.when(_db.put(task));
  };

  /**
   * Updates an existing task in the db
   */
  function updateTask(task) {
    console.log('in TaskService.updateTask', task);
    return $q.when(_db.put(task));
  };

  /**
   * Delete an existing task from the db
   */
  function deleteTask(task) {
    console.log('in TaskService.deleteTask. Task:', task);
    return $q.when(_db.remove(task._id, task._rev));
  };

  /**
   * Retrieve the task info based on the task _id from the db
   */
  function getTask(taskId) {
    console.log('in TaskService.getTask _id: ', taskId);
    return $q.when(_db.get(taskId));
  };

  /**
   * Get all tasks
   */
  function all() {

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

    var index = PouchDbService.findIndex(_tasks, change.id);
    var task = _tasks[index];

    console.log('in TaskService.onDatabaseChange. Change: ', change, index);

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
  function getCategories() {

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