var logger = require('../../tools/hex.logger');
var checker = require('../../tools/hex.checker');
var util = require('../../tools/hex.util');

var HexUiDataHelper = {

  getItem: function(ary, keyId, titleId, dataId, selectedKey, isPackData) {
    var items = [];
    for (var i = 0; i < ary.length; i++) {
      var item = {};
      item.key = ary[i][keyId];
      item.title = ary[i][titleId];
      if (isPackData == true) {
        item.data = ary[i];
      } else {
        if (dataId != null) {
          item.data = ary[i][dataId];
        }
      }

      if (selectedKey == item.key) {
        item.isSelected = true;
      }
      items.push(item);
    }
    return items;
  }
};

module.exports = HexUiDataHelper;
