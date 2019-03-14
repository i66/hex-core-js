var checker = require('../../core/tools/hex.checker');
var util = require('../../core/tools/hex.util');

const KEY_DEFAULT = 'id';

var HexFlexItemListClass = function(keyId) {
  this._itemList =  [];
  this._itemIdMap = {};
  this.keyId = KEY_DEFAULT;
  if (checker.isSetNonNull(keyId)) {
    this.keyId = keyId;
  }

  this.addItem = function(item, isAllowOverwrite) {
    if (checker.isSetNonNull(item[this.keyId])) {
      if (!checker.isSetNonNull(this._itemIdMap[item[this.keyId]]) ||
          isAllowOverwrite == true) {
        this._itemIdMap[item[this.keyId]] = item;
        this._itemList.push(item);
        return true;
      }
    }

    return false;
  };

  this.removeItemById = function(id) {
    var item = this._itemIdMap[id];
    if (checker.isSetNonNull(item)) {
      return this.removeItem(item);
    }
    return false;
  };

  this.removeItem = function(item) {
    var listSize = this._itemList.length;
    var pos = -1;
    for (var i = 0; i < listSize; i++) {
      if (this._itemList[i][this.keyId] == item[this.keyId]) {
        pos = i;
        break;
      }
    }

    // Remove
    if (pos != -1) {
      this._itemList.splice(pos, 1);
      delete this._itemIdMap[item[this.keyId]];
      return true;
    }

    return false;
  };

  this.sortByProp = function(prop, isDesc) {
    this._itemList = util.sortAryByProp(this._itemList, prop, isDesc);
  },

  this.getItemById = function(id) {
    var item = this._itemIdMap[id];
    if (checker.isSetNonNull(item)) {
      return item;
    }
    return null;
  };

  this.popItemById = function(id) {
    var item = this.getItemById(id);
    if (item != null) {
      this.removeItem(item);
    }
    return item;
  };

  this.getFirst = function() {
      return this._itemList[0];
  };

  this.getItemAry = function() {
    return this._itemList.slice();
  };

  this.getItemList = function() {
    return this._itemList.slice();
  };

  this.getAllItemByKey = function(keyId, keyValue) {
    var resList = [];
    var listSize = this.getCount();
    for (var i = 0; i < listSize; i++) {
      if (this._itemList[i][keyId] == keyValue) {
        resList.push(this._itemList[i]);
      }
    }
    return resList;
  };

  this.getCount = function() {
    return this._itemList.length;
  };

  this.reset = function() {
    this._itemList = [];
    this._itemIdMap = {};
  };
};

module.exports = HexFlexItemListClass;
