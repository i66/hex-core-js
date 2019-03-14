// Tools
var checker = require('../../core/tools/hex.checker');
var HexFieldPropMgr = require('./hex.field-prop.mgr');

var _mapDict = {};

var HexFieldMapper = {
  set: function(fieldKey, mapKey) {
    _mapDict[fieldKey] = mapKey;
  },

  get: function(fieldKey) {
    var mapKey = _mapDict[fieldKey];
    if (checker.isSet(mapKey)) {
      return mapKey;
    }
    return null;
  },

  clear: function(fieldKey) {
    if (checker.isSet(_mapDict[fieldKey])) {
      delete _mapDict[fieldKey];
      return true;
    }
    return false;
  },

  mapDataKey: function(data, fieldType) {
    if (checker.isArray(data)) {
      return this.mapDataKeyAry(data, fieldType);
    } else {
      return this.mapDataKeySingle(data, fieldType);
    }
  },

  mapDataKeyAry: function(dataAry, fieldType) {
    var mappedDataAry = [];
    for (var i = 0; i < dataAry.length; i++) {
      mappedDataAry.push(this.mapDataKeySingle(dataAry[i], fieldType));
    }
    return mappedDataAry;
  },

  mapDataKeySingle: function(data, fieldType) {
    var mappedData = Object.assign({}, data);
    var curFieldType;
    var curMappedKey;
    var curFieldObjType;
    for (var fieldKey in fieldType) {
      curFieldType = fieldType[fieldKey];
      curMappedKey = this.get(curFieldType);

      if (curMappedKey != null && checker.isSet(data[curMappedKey])) {
        delete mappedData[curMappedKey];
        mappedData[curFieldType] = data[curMappedKey];

        curFieldObjType = HexFieldPropMgr.getFieldObjType(curFieldType);
        if (curFieldObjType != null) {
          mappedData[curFieldType] = this.mapDataKeySingle(
            mappedData[curFieldType],
            HexFieldPropMgr.getFieldObjType(curFieldType));
        }

      }
    }
    return mappedData;
  },

  reset: function() {
    _mapDict = {};
  }
};

module.exports = HexFieldMapper;
