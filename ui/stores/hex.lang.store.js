var HexActionType = require('../types/hex.action.type');
var HexStoreDataHelper = require('./hex.store.data.helper');
var HexFileMgr = require('../io/hex.file.mgr.factory').getInstance();
var HexStoreDataMgr = require('../io/hex.store.data.mgr');
var HexAppConstant = require('../types/hex.app.constant');
var HexStoreDataHelper = require('./hex.store.data.helper');
var HexStore = require('../../core/stores/hex.store');
var HexFileIoStatus = require('../types/hex.file.io.status');

var checker = require('../../core/tools/hex.checker');
var logger = require('../../core/tools/hex.logger');

const MODULE_ID = 'EboxUiLangStore';
const EXT_LANG_FILE = '.json';

var ID_ACTION_CHANGE = HexActionType.LANG_CHANGE;
var ID_ACTION_INIT = HexActionType.APP_INIT;

var _langPath = '';
var _curLang = '';
var _langList = [];

function getRes(key) {
  if (this.has(key)) {
    return this.get(key);
  }
  return key;
}

var HexLangStore = Object.assign({}, HexStore, {
  _initAction: function() {
    this._actionHelper.registerAction(
      ID_ACTION_INIT, this._handleActionInit);
    this._actionHelper.registerActionAsync(
      ID_ACTION_CHANGE, this._handleActionChangeAsync);
  },
  _handleActionInit: function(storeData, method, data) {
    this._loadLangList();
    return null;
  },
  _handleActionChange: function(storeData, method, data) {
    var langDict = this._loadLangDict(data);
    return this._onLandDictLoaded(langDict);
  },
  _handleActionChangeAsync: function(storeData, method, data, callback) {
    var _this = this;
    this._loadLangDict(data, function(langDict) {
      callback(_this._onLandDictLoaded(langDict));
    });
  },
  _onLandDictLoaded: function(langDict) {
    if (langDict != null) {
      return HexStoreDataHelper.getRes(
        HexStoreDataMgr.getImmutMap(langDict));
    }
    return null;
  },

  _handleResetStore: function() {
    return null;
  },
  _loadLangList: function() {
    _langPath =
      HexFileMgr.ensurePackagePath(HexAppConstant.LANG.L10N_FILE_PATH);

    var _this = this;
    HexFileMgr.listFileInFolder(_langPath, function(stat, msg, data) {
      if (stat == HexFileIoStatus.LIST_SUCCESS) {
        _this._handleLangList(data);
      }

    });

  },

  _handleLangList: function(fileList) {
    var langList = [];
    var curLangFile;
    for (var i = 0; i < fileList.length; i++) {
      curLangFile = fileList[i];
      if (curLangFile.indexOf(EXT_LANG_FILE) > 0) {
        langList.push(curLangFile.replace(EXT_LANG_FILE, ''));
        // logger.info('Language Supported: ' + langList[langList.length - 1]);
      }
    }
    _langList = langList;
    this._setReady();
  },

  _loadLangDict: function(langId, callback) {
    if (_langList.indexOf(langId) > -1 && _curLang != langId) {
      _curLang = langId;
      var _this = this;

      HexFileMgr.readFileJson(
        HexFileMgr.joinPath([_langPath, langId + EXT_LANG_FILE]),
        function(stat, msg, data) {
          var updatedData = HexStoreDataMgr.getImmutMap(data);
          callback(updatedData);
          //_this._handleEventData(updatedData);
        }
      );
    }

  },

  reset: function() {
    _langPath = '';
    _curLang = '';
    _langList = [];
    this._loadLangList();
  },

  getAll: function() {
    this._data.getRes = getRes;
    return this._data;
  },
  getList: function() {
    return _langList.slice(0);
  },
  setLang: function(lang) {
    this._handleEvent({
      actionType: ID_ACTION_CHANGE,
      data: lang
    });
    /*
    var newData = this._handleActionChange(this._data, null, lang);
    if (newData != null && newData.error == null) {
      this._data = newData.data;
    }
    */
  }
});

HexLangStore.init(MODULE_ID, ID_ACTION_CHANGE, null, true);

module.exports = HexLangStore;
