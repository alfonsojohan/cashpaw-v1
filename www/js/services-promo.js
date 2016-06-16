angular.module('starter.services')
.service('PromoService', PromoService)
;

/**
 * Implementation of PromoService
 */
function PromoService() {

  var _that = this;

  console.log('>>> in PromoService.');

  /**
   * Function to generate random number of points for each dummy user
   */
  var randomPoints = function () {
    var min = 100;
    var max = 1000;
    return Math.floor(Math.random() * (max - min) + min);
  };

  /**
   * Static array of dummy users
   */
  this.promotions = [{
    _id: 'promo_kidz',
    title: 'Kidzania Promo Tickets',
    img: 'img/promo/kidz.gif',
    points: randomPoints(),
    notes: 'Cillum aliqua in dolor cillum. Consectetur incididunt cillum veniam irure sint tempor labore. Qui cupidatat fugiat ea do nostrud elit. Reprehenderit labore pariatur dolor fugiat eiusmod velit dolore incididunt officia ullamco exercitation irure in aliquip. Nulla velit velit dolor sit exercitation eiusmod qui culpa amet ipsum ad.'
  }, {
    _id: 'promo_tgv',
    title: 'TGV Tickets',
    img: 'img/promo/tgv.gif',
    points: randomPoints(),
    notes: 'Enim laborum excepteur cillum Lorem nisi commodo adipisicing id occaecat. Pariatur occaecat ea tempor in sint minim esse. Ex minim proident officia commodo dolore voluptate consectetur commodo. Duis do ad consequat voluptate qui proident. Commodo minim consectetur veniam fugiat ullamco cupidatat consectetur. Dolore sint pariatur nisi consequat elit aliquip reprehenderit veniam proident irure pariatur ut minim. Et sit cupidatat in ad ea laborum deserunt.',
  }, {
    _id: 'promo_lego',
    title: 'Legoland Fun',
    img: 'img/promo/lego.gif',
    points: randomPoints(),
    notes: 'Ullamco aute enim amet irure occaecat amet elit tempor labore duis dolore cillum qui reprehenderit. Pariatur pariatur laborum in cillum in anim nulla cupidatat tempor esse culpa. Cupidatat aliqua officia duis laborum sunt consectetur incididunt laboris fugiat deserunt in velit sint qui. Laboris veniam laborum sint culpa eu aliqua officia anim ad eiusmod exercitation.',
  }];

  this.all = function() {
    console.log('in PromoService.all', _that.promotions);
    return _that.promotions;
  };

  this.get = function (id) {
    for (var i = 0; i < _that.promotions.length; i++) {
      if (id == _that.promotions[i]._id) {
        return _that.promotions[i];
      }
    }
  };

}
;