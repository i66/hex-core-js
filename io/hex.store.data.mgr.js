var Immutable = require('immutable');
var checker = require('../tools/hex.checker');
var logger = require('../tools/hex.logger');

const MODULE_ID = 'HexStoreDataMgr';

var HexStoreDataMgr = {
  getAry: function(storeData, defaultAry) {
    if (checker.isSetNonNull(storeData)) {
      if (storeData.toOrderedSet) {
        return storeData.toOrderedSet().toJS();
      } else if (checker.isArray(storeData)) {
        // Already converted
        return storeData;
      }
    }
    if (checker.isSetNonNull(defaultAry)) {
      return defaultAry;
    }
    logger.error('Can not convert to Array:' , MODULE_ID);
    logger.error(storeData , MODULE_ID);
    return null;
  },

  getMap: function(storeData, defaultMap) {
    if (checker.isSetNonNull(storeData)) {
      if (storeData.toOrderedMap) {
        return storeData.toOrderedMap().toJS();
      } else if (storeData.toJS) {
        return storeData.toJS();
      } else {
        // Already Converted!
        return storeData;
      }
    }
    if (checker.isSetNonNull(defaultMap)) {
      return defaultMap;
    }
    logger.error('Can not convert to Map:' , MODULE_ID);
    logger.error(storeData , MODULE_ID);
    return null;
  },

  getMapField: function(storeData, fieldKey, defaultValue) {
    var mapObj = this.getMap(storeData);
    if (checker.isSetNonNull(mapObj)) {
      var res = mapObj[fieldKey];

      if (checker.isSet(res)) {
        return res;
      }
    }
    return defaultValue;
  },

  getMapAry: function(storeData) {
    var data = {};
    data.ary = this.getAry(storeData);
    data.map = this.getMap(storeData);
    return data;
  },

  getImmutMap: function(data) {
    if (!checker.isSetNonNull(data)) {
      data = {};
    }
    return Immutable.fromJS(data);
  },
};
module.exports = HexStoreDataMgr;
