
var checker = require('../../core/tools/hex.checker');
var format = require('../../core/tools/hex.format');

function HexCacheHelperClass() {
  this._cacheMap = {};
  // Public functions
  // -----------------------------------------------------------------
  this.set = function(id, val) {
    this._cacheMap[id] = val;
  };
  this.isCached = function(id) {
    return checker.isSet(this._cacheMap[id]);
  };
  this.get = function(id, defaultVal) {
    if (this.isCached(id)) {
      return this._cacheMap[id];
    }
    if (!checker.isSet(defaultVal)) {
      defaultVal = null;
    }
    return defaultVal;
  };

  this.reset = function() {
    this._cacheMap = {};
  };
  // Private functions
  // -----------------------------------------------------------------

}

module.exports = HexCacheHelperClass;
