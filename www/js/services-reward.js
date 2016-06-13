angular.module('starter.services')
  .service('RewardService', RewardService)
  ;

/**
 * Implementation of RewardService
 */
function RewardService(
  $q,
  POUCH_CONSTANTS,
  PouchDbService) {

  var _db = PouchDbService.db();
  var _tasks;
  var _that = this;

  _that.currentTask = null;
  _that.category = null;

  console.log('in RewardService');

  return {
    all: all,
    add: add,
    update: update,
    remove: remove,
    get: get,
  };

  function add(reward) {
    task._id = PouchDbService.newId(POUCH_CONSTANTS.DOC_TYPE.REWARD, reward);
    console.log('in RewardService.add. ', reward);
    return $q.when(_db.put(reward));
  };

  function update(task) {
    console.log('in RewardService.updateTask');
    return $q.when(_db.put(task));
  };

  function remove(task) {
    console.log('in RewardService.deleteTask. Task:', task);
    return $q.when(_db.remove(task._id, task._rev));
  };

  function get(taskId) {
    console.log('in RewardService.getTask', taskId);
    return $q.when(_db.get(taskId));
  };

  function all() {

    console.log('in RewardService.all');

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

    console.log('in RewardService.onDatabaseChange. Change: ', change, index);

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
    console.log('in RewardService.findIndex ', array, id)
    var low = 0, high = array.length, mid;
    while (low < high) {
      mid = (low + high) >>> 1;
      array[mid]._id < id ? low = mid + 1 : high = mid
    }
    return low;
  };

  /**
   * Generates a _id for each category with the prefix of cat_ 
   */
  function generateCategoryId(category) {

    var now = new Date().getTime();
    var prefix = "cat_";

    var id = prefix +
      pouchCollate.toIndexableString([
        encodeURI(category.name), 
        encodeURI(category.creator.name), 
        now
    ]);

    id.replace(/\u0000/g, '\u0001');  // This part is to handle bug in chrome if syncing with remote db. see https://github.com/pouchdb/collate

    console.log('in RewardService.generateCategoryId. _id: ', id);
    return id; 
  };

  /**
   * Dummy function to return a fixed list of categories
   */
  function getCategories() {

    console.log('in RewardService.getCategories()');
    
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