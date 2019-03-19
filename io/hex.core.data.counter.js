
// Tools
var checker = require('../tools/hex.checker');

var _countMap = {};

var HexCoreDataCounter = {

  get: function(dataType) {
    var count = _countMap[dataType];
    if (!checker.isSetNonNull(count)) {
      return -1;
    }
    return count;
  },

  set: function(dataType, count) {
    _countMap[dataType] = count;
  },

  update: function(dataType) {
    var count = this.get(dataType) + 1;
    this.set(dataType, count);
  },

  reset: function() {
    _countMap = {};
  }

};

module.exports = HexCoreDataCounter;
