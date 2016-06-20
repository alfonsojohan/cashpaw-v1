angular.module('starter.services')
.service('RewardService', RewardService)
;

/**
 * Implementation of RewardService
 */
function RewardService(
  $q,
  POUCH_CONSTANTS,
  PouchDbService,
  UserService) {

  var _db = PouchDbService.db();
  var _rewards = null;
  var _that = this;

  _that.currentReward = null;

  console.log('in RewardService, db: ', _db);

  /**
   * Returns a blank reward. We use this to ensure the correct
   * reward template is created
   */
  this.create = function () {
    return {
      _id: null,
      assignee: null,
      owner: UserService.currentUser(),
      points: 0,
      promo: null,
    }
  };

  this.add = function (reward) {
    reward.owner = UserService.currentUser();
    reward._id = PouchDbService.newId(POUCH_CONSTANTS.DOC_TYPES.REWARD, reward);
    console.log('in RewardService.add. ', reward);
    return $q.when(_db.put(reward));
  };

  this.remove = function (reward) {
    console.log('in RewardService.remove. reward:', reward);
    return $q.when(_db.remove(reward._id, reward._rev));
  };

  this.update = function (reward) {
    console.log('in RewardService.update', reward);
    return $q.when(_db.put(reward));
  };

  this.get = function (rewardId) {
    console.log('in RewardService.getreward', rewardId);
    return $q.when(_db.get(rewardId));
  };

  this.all = function () {

    console.log('in RewardService.all');

    if (!_rewards) {
      return $q.when(_db.allDocs({
        include_docs: true,
        startkey: POUCH_CONSTANTS.DOC_TYPES.REWARD,
        endkey: POUCH_CONSTANTS.DOC_TYPES.REWARD + POUCH_CONSTANTS.WILDCARD,
      }))
        .then(function (docs) {
          _rewards = docs.rows.map(function (row) {
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

          console.log('rewards list: ', _rewards);

          return _rewards;
        })
    } else {
      return $q.when(_rewards);
    };
  };

  function onDatabaseChange(change) {

    if (0 !== change.id.indexOf(POUCH_CONSTANTS.DOC_TYPES.REWARD)) {
      return;
    };

    console.log('RewardService.onDatabasechange', change);

    var index = PouchDbService.findIndex(_rewards, change.id);
    var reward = _rewards[index];

    console.log('in RewardService.onDatabaseChange. Change: ', change, index);

    if (change.deleted) {
      if (reward) {
        _rewards.splice(index, 1); // delete
      }
    } else {
      if (reward && reward._id === change.id) {
        _rewards[index] = change.doc; // update
      } else {
        _rewards.splice(index, 0, change.doc) // insert
      }
    }

  };

  this.userRewards = function (user) {
    
    var mapFn = function (doc) {
      if (0 == doc._id.indexOf('reward_')) {
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
      var out = [];
      for(var i = 0; i < result.rows.length; i++) {
        out.push(result.rows[i].doc);
      }
      return out;
    }));
      
  };
};