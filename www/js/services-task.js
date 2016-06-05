angular.module('starter.services')
  .factory('TaskService', TaskService)
  ;

/**
 * Implementation of TaskService
 */
function TaskService($q) {

  var _db;
  var _tasks;
  var _that = this;

  console.log('in TaskService');

  return {
    initDb: initDb,

    all: all,
    add: addTask,
    update: updateTask,
    remove: deleteTask,
    get: getTask
  };

  /**
   * Function to create if new, else will open existing db
   */
  function initDb() {
    _db = new PouchDB('cashpaw', {
      adapter: 'websql',
      iosDatabaseLocation: 'default'    // This is now mandatory 
    });

    // Next 2 lines is to debug we are using the right adapter sqlite: true /false
    console.log('in TaskService.initDb. Adapter: ', _db.adapter);
    _db.info().then(console.log.bind(console));
  };

  function addTask(task) {
    console.log('in TaskService.addTask. Task: ', task);
    return $q.when(_db.post(task));
  };

  function updateTask(task) {
    console.log('in TaskService.updateTask');
    return $q.when(_db.put(task));
  };

  function deleteTask(task) {
    console.log('in TaskService.deleteTask. Task:', task);
    return $q.when(_db.remove(task._id, task._rev));
  };

  function getTask(taskId) {
    console.log('in TaskService.getTask', taskId);
    return $q.when(_db.get(taskId));
  };

  function all() {

    console.log('in TaskService.all');

    if (!_tasks) {
      return $q.when(_db.allDocs({ include_docs: true }))
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
          console.log('Tasks list: ', _tasks);
          return _tasks;
        })
    } else {
      return $q.when(_task);
    };
  };

  function onDatabaseChange(change) {

    var index = findIndex(_tasks, change.id);
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

  function findIndex(array, id) {
    console.log('in TaskService.findIndex ', array, id)
    var low = 0, high = array.length, mid;
    while (low < high) {
      mid = (low + high) >>> 1;
      array[mid]._id < id ? low = mid + 1 : high = mid
    }
    return low;
  };

};