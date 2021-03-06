angular.module('starter.services', [])

/**
 * Define db related constants for use and to minimize typo errors
 */
.constant('POUCH_CONSTANTS', {
  'DB_NAME': 'cashpaw',
  'DB_ADAPTER': 'websql',
  'DB_LOCATION': 'default',
  'WILDCARD': '\uffff',
  'DOC_TYPES': {
    'TASK': 'task_',
    'REWARD': 'reward_',
    'CATEGORY': 'cat_',
    'USER': 'user_',
  },
  'REPLICATION': {
    'URL': 'http://localhost',
    'PORT': 5984
  }
})

.constant('AUTH_EVENTS', {
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
})

/**
 * Service with functions that can be reused in various places
 */
.service('UtilityService', function (
  $ionicPopup,
  $ionicHistory) {
    
    // console.log('in UtilityService');

    /**
     * Show a TODO alert
     */
    this.todo = function () {
      $ionicPopup.alert({
        template: "Oops. This is not ready yet",
        title: 'Hang in there!'
      });
    };  

    /**
     * Go back in history and reset the history root 
     * Can override by passing in custom args
     */
    this.goBack = function (count, args) {
      count = count || -1;
      args = args || {
        disableBack: true,
        historyRoot: true
      };

      $ionicHistory.nextViewOptions(args);
      $ionicHistory.goBack(count);
    };    
})

/**
 * Define a singleton for PouchDb so that we can inject it into our
 * controllers and services
 */
.service('PouchDbService', PouchDbService)
;

/**
 * Implementation of the PouchDbService
 */
function PouchDbService(
  POUCH_CONSTANTS) {

  // console.log('>>> In PouchDbService');

  var _db = null;
  var _that = this;

  /**
   * Function to create if new, else will open existing db
   */
  this.init = function () {
    // console.log('>>> PouchDbService.init');

    _db = new PouchDB({
      name: POUCH_CONSTANTS.DB_NAME,
      adapter: POUCH_CONSTANTS.DB_ADAPTER,
      iosDatabaseLocation: POUCH_CONSTANTS.DB_LOCATION,    // This is now mandatory
      auto_compaction: true, 
    });

    /**
     * We now return a promise from the init function so that 
     * the app will wait for the init to complete before proceeding
     * Inspired from:
     * https://www.raymondcamden.com/2014/08/16/Ionic-and-Cordovas-DeviceReady-My-Solution/
     */
    return _db.info();
  };  

  /**
   * Start replication to couchdb / pouchdb server
   */
  // function replicate() {

  //   var uri = POUCH_CONSTANTS.REPLICATION.URL + ':' 
  //     + POUCH_CONSTANTS.REPLICATION.PORT 
  //     + '/' + POUCH_CONSTANTS.DB_NAME;

  //   console.log('>>> PouchDbService.replicate. URL: ', uri);

  //   PouchDB.replicate(
  //     _db, 
  //     uri, 
  //     {
  //       live: true
  //     });
  // };

  /**
   * Get the db instance
   */
  this.db = function () {
    // console.log('>>> PouchDbService.db');
    return _db;
  };

  /**
   * Generate a new _id for different document types
   */
  this.newId = function (docType, obj) {
    // console.log('>>> PouchDbService.newId Type: ', docType, ' Obj: ', obj);

    var now = new Date().getTime();
    var prefix = docType || 'unknown_type_' ;
    var id = null;
    var args = [];

    switch (docType) {
      case POUCH_CONSTANTS.DOC_TYPES.TASK:
      case POUCH_CONSTANTS.DOC_TYPES.REWARD:
        args.push(
          encodeURI(obj.name),
          encodeURI(obj.owner.name),
          now
        ); 
        break;

      case POUCH_CONSTANTS.DOC_TYPES.CATEGORY:
        args.push(
          encodeURI(obj.name),
          encodeURI(obj.creator.name),
          now
        ); 
        break;
    
      default:
        throw new Error('PouchDbService: Unknown doc type: ', docType);
    };

    id = prefix + pouchCollate.toIndexableString(args);
    // This part is to handle bug in chrome if syncing with remote db. 
    // See https://github.com/pouchdb/collate
    id.replace(/\u0000/g, '\u0001'); 
    
    return id;

  };  // eo newId

  /**
   * Get the specified element index based on id
   */
  this.findIndex = function (array, id) {
    // console.log('>>> PouchDbService.findIndex ', array, id)
    var low = 0, high = array.length, mid;
    while (low < high) {
      mid = (low + high) >>> 1;
      array[mid]._id < id ? low = mid + 1 : high = mid
    }
    return low;
  };  

};  // eo PouchDbService
