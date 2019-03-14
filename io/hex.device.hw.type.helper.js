
//var EboxUiFloorFieldType =
//    require('../types/field/eboxui.floor.field.type');
//var EboxUiZoneFieldType =
//    require('../types/field/eboxui.zone.field.type');
//var EboxUiDeviceFieldType =
//    require('../types/field/eboxui.device.field.type');
//var EboxUiFilterType = require('../types/eboxui.filter.type');

var HexDeviceItemCate = require('../types/hex.device.item.cate');
var HexDeviceItemType = require('../types/hex.device.item.type');

var checker = require('../../core/tools/hex.checker');
var util = require('../../core/tools/hex.util');

var HexDeviceHwTypeHelper = {

  // Public functions
  // -----------------------------------------------------------------
  isIndicator: function(hwType) {
    return HexDeviceItemCate.isIndicator(this.getItemType(hwType));
  },

  isFireProofDoor: function(hwType) {
    return HexDeviceItemCate.isFireProofDoor(this.getItemType(hwType));
  },

  isSensor: function(hwType) {
    return HexDeviceItemCate.isSensor(this.getItemType(hwType));
  },

  getItemType: function(hwType, defaultVal) {
    if (!checker.isSetNonNull(defaultVal)) {
      defaultVal = null;
    }
    return this._parseDeviceHwType(hwType, defaultVal);
  },

  getItemCate: function(hwType, defaultVal) {
    if (!checker.isSetNonNull(defaultVal)) {
      defaultVal = null;
    }
    var itemType = this._parseDeviceHwType(hwType, null);
    return HexDeviceItemCate.fromItemType(itemType, defaultVal);
  },

  getDirectionType: function(hwType, defaultVal) {
    // one-direction or two-direction
  },

  getSideType: function(hwType, defaultVal) {
    // single-sided or double-sided
  },

  // Private functions
  // -----------------------------------------------------------------

  _parseDeviceHwType: function(hwType, defaultVal) {
    if ((hwType & 0x11) == 0x11) {
      return HexDeviceItemType.FIRE_PROOF_DOOR;
    }else if (hwType &  0x01) {
      return HexDeviceItemType.INDICATOR_M1;
    } else if (hwType &  0x02) {
      return HexDeviceItemType.INDICATOR_M2;
    } else if (hwType &  0x04) {
      return HexDeviceItemType.INDICATOR_M3;
    } else if (hwType &  0x100) {
      return HexDeviceItemType.SENSOR_HEAT;
    } else if (hwType &  0x200) {
      return HexDeviceItemType.SENSOR_HUMIDITY;
    } else if (hwType &  0x400) {
      return HexDeviceItemType.SENSOR_SMOKE;
    } else if (hwType &  0x800) {
      return HexDeviceItemType.SENSOR_MANUAL;
    } else if (hwType ==  0) {
      return HexDeviceItemType.EXIT;
    }
    return defaultVal;
  },

};

module.exports = HexDeviceHwTypeHelper;
