var uuid = require('uuid');
var checker = require('../../core/tools/hex.checker');
var AppItemType = {};
var AppItemUUIdPrefix = {}

var itemTypePrefixMap = {};
for (var key in AppItemType) {
  var curKey = AppItemType[key];
  itemTypePrefixMap[curKey] = AppItemUUIdPrefix[key];
}

var uuidMap = {};

function getUUIdByItemType(itemType) {
  var prefix = itemTypePrefixMap[itemType];
  if (!checker.isSetNonNull(prefix)) {
    prefix = 'item_';
  }
  var uid = uuid.v4();
  return prefix + uid.substring(0, 8);
}

var HexUUIdMgr = {
  registerUUId: function(uuid) {
    if (this.isValidUUId(uuid)) {
      uuidMap[uuid] = true;
      return true;
    }
    return false;
  },
  isUUIdExists: function(uuid) {
    return uuidMap[uuid] == true;
  },
  isValidUUId: function(uuid) {
    var tokens = uuid.split('_');
    if (tokens.length == 2 && tokens[1].length == 8) {
      return true;
    }
    return false;
  },
  getUUId: function(itemType) {
    var uid = getUUIdByItemType(itemType);
    while (this.isUUIdExists(uid)) {
      uid = getUUIdByItemType(itemType);
    }
    this.registerUUId(uid);
    return uid;
  },
  reset: function() {
    uuidMap = {};
  }
};

module.exports = HexUUIdMgr;
