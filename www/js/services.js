angular.module('starter.services', [])

  .factory('Chores', function () {
    // Might use a resource here that returns a JSON array

    var choreList = ['Do homework', 'Clean room', 'Throw garbage', 'Vacuum room', 'Laundry'];
    var categoryList = ['House', 'Outdoors', 'Meals', 'Learning', 'General', 'Cleaning'];
    var descList = [
      'You need to do this!',
      'Eat something',
      'Please get it done',
      'No pain no gain',
      'Disneyworld is not a dream',
      'Its pasta night tonight'
    ];

    var imgList = [
      'adam.jpg',
      'ben.png',
      'max.png',
      'mike.png',
      'perry.png',
    ];

    var chores = [];
    var choreCount = 10;

    /**
     * Generate random data
     */
    for (var i = 0, r = 0; i < choreCount; i++) {

      chore = { id: i };

      r = Math.floor((Math.random() * choreList.length));
      chore.name = choreList[r];

      r = Math.floor((Math.random() * categoryList.length));
      chore.category = categoryList[r];
      chore.categoryImg = 'img/categories/price-tag.png';
      
      r = Math.floor((Math.random() * categoryList.length));
      chore.note = descList[r];

      r = Math.floor((Math.random() * imgList.length));
      chore.img = 'img/' + imgList[r];

      r = Math.round(Math.random() * (200 - 10) + 10);
      chore.points = Math.round(r / 10) * 10;

      r = Math.round(Math.random() * (120 - 15) + 15);
      r = Math.ceil(r/5) * 5;
      chore.duration = r;
      
      chore.completed = false;

      chores.push(chore);
    };

    console.log('Chores', chores);

    return {
      all: function () {
        return chores;
      },
      remove: function (chore) {
        chores.splice(chores.indexOf(chore), 1);
      },
      get: function (choreId) {
        for (var i = 0; i < chores.length; i++) {
          if (chores[i].id === parseInt(choreId)) {
            return chores[i];
          }
        }
        return null;
      }
    };
  })

  .factory('Chats', function () {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var chats = [{
      id: 0,
      name: 'Ben Sparrow',
      lastText: 'You on your way?',
      face: 'img/ben.png'
    }, {
        id: 1,
        name: 'Max Lynx',
        lastText: 'Hey, it\'s me',
        face: 'img/max.png'
      }, {
        id: 2,
        name: 'Adam Bradleyson',
        lastText: 'I should buy a boat',
        face: 'img/adam.jpg'
      }, {
        id: 3,
        name: 'Perry Governor',
        lastText: 'Look at my mukluks!',
        face: 'img/perry.png'
      }, {
        id: 4,
        name: 'Mike Harrington',
        lastText: 'This is wicked good ice cream.',
        face: 'img/mike.png'
      }, {
        id: 5,
        name: 'Perry Governor',
        lastText: 'Look at my mukluks!',
        face: 'img/perry.png'
      }, {
        id: 6,
        name: 'Mike Harrington',
        lastText: 'This is wicked good ice cream.',
        face: 'img/mike.png'
      }, {
        id: 7,
        name: 'Perry Governor',
        lastText: 'Look at my mukluks!',
        face: 'img/perry.png'
      }, {
        id: 8,
        name: 'Mike Harrington',
        lastText: 'This is wicked good ice cream.',
        face: 'img/mike.png'
      }, {
        id: 9,
        name: 'Perry Governor',
        lastText: 'Look at my mukluks!',
        face: 'img/perry.png'
      }, {
        id: 10,
        name: 'Mike Harrington',
        lastText: 'This is wicked good ice cream.',
        face: 'img/mike.png'
      }, {
        id: 11,
        name: 'Perry Governor',
        lastText: 'Look at my mukluks!',
        face: 'img/perry.png'
      }, {
        id: 12,
        name: 'Mike Harrington',
        lastText: 'This is wicked good ice cream.',
        face: 'img/mike.png'
      }];

    return {
      all: function () {
        return chats;
      },
      remove: function (chat) {
        chats.splice(chats.indexOf(chat), 1);
      },
      get: function (chatId) {
        for (var i = 0; i < chats.length; i++) {
          if (chats[i].id === parseInt(chatId)) {
            return chats[i];
          }
        }
        return null;
      }
    };
  });
