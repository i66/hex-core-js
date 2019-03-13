// Constants and Types
var HexActionType = require('../types/hex.action.type');
var HexPrefFieldType = require('../types/field/hex.pref.field.type');

// Modules
var HexStoreDataHelper = require('./hex.store.data.helper');

// Stores
var HexStore = require('../../core/stores/hex.store');

const MODULE_ID = 'HexPrefStore';
const FILE_PREF = 'pref.json';

const ID_ACTION_CHANGE = HexActionType.PREF_CHANGE;
const ID_ACTION_LOAD = HexActionType.APP_INIT;

// Should add general PRef Type
var fieldType = HexPrefFieldType;
var _isLangChanged = false;
var _isVolChanged = false;
var _isFullScreenChanged = false;

var HexPrefStore = Object.assign({}, HexStore, {
  // Public Functions >>>>>

  isLangChanged: function() {
    return _isLangChanged;
  },

  isVolChanged: function() {
    return _isVolChanged;
  },

  isFullScreenChanged: function() {
    return _isFullScreenChanged;
  },

  getLang: function() {
    return this._data.get(fieldType.LANG);
  },

  getVol: function() {
    return this._data.get(fieldType.IS_VOL_ON);
  },

  getLogLevel: function() {
    return this._data.get(fieldType.LOG_LEVEL);
  },

  getIsFullScreen: function() {
    return this._data.get(fieldType.IS_FULL_SCREEN);
  },

  getIsNeverClose: function() {
    return this._data.get(fieldType.IS_NEVER_CLOSE);
  },

  // Private Functions >>>>>

  _initAction: function() {
    this._actionHelper.registerAction(
      ID_ACTION_CHANGE, this._handleActionChange);
    this._actionHelper.registerAction(
      ID_ACTION_LOAD, this._handleActionLoadPref);
  },

  _handleActionChange: function(storeData, method, data) {
    return HexStoreDataHelper.postMap(data, storeData, fieldType);
  },

  _handleActionLoadPref: function(storeData, method, data) {
    return this._loadPref(FILE_PREF);
  },

  _preUpdateData: function(updatedData) {
    var langField = fieldType.LANG;
    if (updatedData.get(langField) != this._data.get(langField)) {
      _isLangChanged = true;
    } else {
      _isLangChanged = false;
    }

    var volField = fieldType.IS_VOL_ON;
    if (updatedData.get(volField) != this._data.get(volField)) {
      _isVolChanged = true;
    } else {
      _isVolChanged = false;
    }

    var fullScreemField = fieldType.IS_FULL_SCREEN;
    if (updatedData.get(fullScreemField) != this._data.get(fullScreemField)) {
      _isFullScreenChanged = true;
    } else {
      _isFullScreenChanged = false;
    }
  },

  _preEmitChange: function(updatedData) {
    this._savePref(FILE_PREF);
  },

  _handleResetStore: function() {
    return null;
  },

});

HexPrefStore.init(MODULE_ID, ID_ACTION_CHANGE, fieldType);

module.exports = HexPrefStore;
