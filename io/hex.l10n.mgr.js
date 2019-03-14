var EventEmitter = require('events').EventEmitter;
var HexCoreDataType = require('../types/hex.core.data.type');
var L10N = require('../types/hex.l10n.type');
var HexCoreDataCounter = require('./hex.core.data.counter');
var HexStoreDataMgr = require('./hex.store.data.mgr');

var checker = require('../tools/hex.checker');
var util = require('../tools/hex.util');
var logger = require('../tools/hex.logger');

const MODULE_ID = 'HexL10nMgr';

var _storeData = null;
var _dataMap = null;
var _langList = null;

const DATA_TYPE = HexCoreDataType.L10N;

var HexL10nMgr = Object.assign({}, EventEmitter.prototype, {

  // Public functions
  // -----------------------------------------------------------------
  emitChange: function(eventType) {
    this.emit(eventType);
  },

  addChangeListener: function(eventType, callback) {
    this.on(eventType, callback);
  },

  removeChangeListener: function(eventType, callback) {
    this.removeListener(eventType, callback);
  },

  // Get Rev -------------------------------------------------------------

  getRev: function() {
    return HexCoreDataCounter.get(DATA_TYPE);
  },

  // Get By Type -------------------------------------------------------------

  getMap: function(isUseDefault) {
    if (checker.isSetNonNull(_dataMap)) {
      return _dataMap;
    }
    if (isUseDefault == true) {
      return {};
    }
    return null;
  },

  getLangList: function(isUseDefault) {
    if (checker.isSetNonNull(_langList)) {
      return _langList;
    }
    if (isUseDefault == true) {
      return [];
    }
    return null;
  },

  getLangId: function() {
    return this.get(L10N.LANG_ID, '');
  },

  get: function(keyId, defaultVal) {
    if (checker.isSetNonNull(_dataMap)) {
      var res = _dataMap[keyId];
      if (checker.isSetNonNull(res)) {
        return res;
      }
    }

    if (checker.isSetNonNull(defaultVal)) {
      return defaultVal;
    }
    logger.warn('L10N Key not set: ' + keyId, MODULE_ID);
    return keyId;
  },

  // Set Data -------------------------------------------------------

  set: function(dataImmutable) {
    if (dataImmutable === _storeData) {
      // No change
      return;
    }
    var dataMap = HexStoreDataMgr.getMap(dataImmutable);
    if (dataMap != null) {
      _dataMap = dataMap;
      _storeData = dataImmutable;
      HexCoreDataCounter.update(DATA_TYPE);
    }
  },

  setLangList: function(langList) {
    if (checker.isArray(langList)) {
      _langList = langList;
    }
  },

  // Get by UUID  ------------------------------------------------

  reset: function() {
    _dataMap = null;
    HexCoreDataCounter.reset();
  },

  // Private functions
  // -----------------------------------------------------------------

});

module.exports = HexL10nMgr;
