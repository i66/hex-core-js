var checker = require('../../core/tools/hex.checker');
var HexPrimitiveType = require('../types/hex.primitive.type');

var fieldTypeMap = {};
var fieldDefaultMap = {};

var HexFieldTypeMgr = {

  set: function(fieldKey, fieldType, defaultVal) {
    if (!checker.isNonEmptyStr(fieldKey) ||
        !checker.isInCollection(fieldType, HexPrimitiveType)) {
      return false;
    }

    fieldTypeMap[fieldKey] = fieldType;

    if (checker.isSet(defaultVal)) {
      fieldDefaultMap[fieldKey] = defaultVal;
    }

    return true;
  },

  getType: function(fieldKey) {
    if (checker.isSetNonNull(fieldTypeMap[fieldKey])) {
      return fieldTypeMap[fieldKey];
    }
    return null;
  },

  getDefault: function(fieldKey) {
    if (checker.isSet(fieldDefaultMap[fieldKey])) {
      return fieldDefaultMap[fieldKey];
    }
    return undefined;
  }

};

module.exports = HexFieldTypeMgr;
