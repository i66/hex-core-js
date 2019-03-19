// External Modules
var Immutable = require('immutable');
var EventEmitter = require('events').EventEmitter;

// Constants and Types
var HexActionType = require('../../types/hex.action.type');

// Modules
var EboxUiDispatcher = require('../dispatcher/hex.dispatcher');
var HexStoreDataHelper = require('./hex.store.data.helper');
var HexStoreActionHelperClass = require('./hex.store.action.helper.class');
var HexPathMgr = require('../../io/hex.path.mgr.factory').getInstance();
var HexFileMgr = require('../../io/hex.file.mgr.factory').getInstance();
var HexStoreDataMgr = require('../../io/hex.store.data.mgr');
var HexFileIoStatus = require('../../types/hex.file.io.status');

// Tools
var checker = require('../../tools/hex.checker');
var logger = require('../../tools/hex.logger');

var ID_ACTION_READY = HexActionType.READY;
var ID_ACTION_SAVE_DONE = HexActionType.SAVE_DONE;

var HexStore = Object.assign({}, EventEmitter.prototype, {
  _id: null,
  _idActionChange: null,
  _data: null,
  _actionHelper: null,
  _fieldType: null,
  _isReady: false,

  getId: function() {
    return this._getId();
  },
  getAll: function() {
    return this._getAll();
  },
  emitChange: function() {
    this.emit(this._idActionChange);
  },
  emitReady: function() {
    this.emit(ID_ACTION_READY, this._id);
  },
  emitSaveDone: function(isSuccess) {
    this.emit(ID_ACTION_SAVE_DONE, isSuccess);
  },
  emitEvent: function(eventId) {
    this.emit(eventId);
  },
  addChangeListener: function(callback) {
    this.on(this._idActionChange, callback);
  },
  addReadyListener: function(callback) {
    this.on(ID_ACTION_READY, callback);
  },
  addSaveDoneListener: function(callback) {
    this.on(ID_ACTION_SAVE_DONE, callback);
  },
  removeChangeListener: function(callback) {
    this.removeListener(this._idActionChange, callback);
  },
  removeReadyListener: function(callback) {
    this.removeListener(ID_ACTION_READY, callback);
  },
  addEventListener: function(eventId, callback) {
    this.on(eventId, callback);
  },
  removeEventListener: function(eventId, callback) {
    this.removeListener(eventId, callback);
  },
  reset: function() {
    this._data = this._initData();
    this._initCustom();
    this.removeAllListeners();
  },
  _getId: function() {
    return this._id;
  },
  _getAll: function() {
    return this._data;
  },
  _handleEvent: function(param) {
    if (this._actionHelper.isSyncHandler(param)) {
      var updatedData = this._actionHelper.handleEvent(param, this._data);
      // Check updates
      var res = this._handleEventData(updatedData);
      if (res == true) {
        this._onDataUpdated(param.actionType);
      }
    } else if (this._actionHelper.isAsyncHandler(param)) {
      var _this = this;
      this._actionHelper.handleEventAsync(param, this._data,
        function(updatedData) {
          var res = _this._handleEventData(updatedData);
          if (res == true) {
            _this._onDataUpdated(param.actionType);
          }
        });
    }

  },
  _handleEventData: function(updatedData) {
    if (updatedData != null && updatedData !== this._data) {
      this._preUpdateData(updatedData);
      this._data = updatedData;
      this._preEmitChange(updatedData);
      //logger.info('Store Updated!', this._id);
      var _this = this;
      // Prevent callback chain
      setTimeout(function() {
        _this.emitChange();
      }, 0);
      return true;
    } else {
      this._preEmitNotChange(updatedData);
    }
    return false;
  },
  _onDataUpdated: function(actionType) {
    // Implemeneted by subclass
  },
  _initData: function() {
    return Immutable.fromJS(
      HexStoreDataHelper.initDefaultData(this._fieldType));
  },
  _initAction: function() {
    this._actionHelper.registerAction(
      this._idActionChange, this._handleActionChange);
  },
  _initCustom: function() {

  },
  _preEmitChange: function(updatedData) {

  },
  _preEmitNotChange: function(updatedData) {

  },
  _preUpdateData: function(updatedData) {

  },
  _handleResetStore: function() {
    return HexStoreDataHelper.getRes(this._initData());
  },
  init: function(id, idActionChange, fieldType, isCustomReady) {
    this._id = id;
    this._idActionChange = idActionChange;
    this._fieldType = fieldType;
    this._actionHelper = new HexStoreActionHelperClass(this, id);
    this._data = this._initData();

    this._actionHelper.registerAction(
      HexActionType.RESET_STORE, this._handleResetStore);

    this._initAction();
    this._initCustom();
    EboxUiDispatcher.register(this._handleEvent.bind(this));

    if (isCustomReady !== true) {
      this._setReady();
    }
  },

  _loadFromLocalStorage: function(fileName) {
    if (checker.isSetNonNull(Storage)) {

      var res = localStorage.getItem(this._id + '@' + fileName);
      var isDone = false;
      try {
        var data = JSON.parse(res);
        isDone = true;
      }catch (err) {
        msg = err.toString();
      }

      var updatedData = this._initData();
      if (isDone == true) {
        updatedData = updatedData.merge(data);
      }
      return updatedData;
    }
  },

  _saveToLocalStorage: function(fileName, data) {
    if (checker.isSetNonNull(Storage)) {
      localStorage.setItem(this._id + '@' + fileName, JSON.stringify(data));
    }
  },

  _loadPrefAsync: function(fileName, callback) {
    if (checker.isWeb()) {
      var updatedData = this._loadFromLocalStorage(fileName);
      callback(HexStoreDataHelper.getRes(updatedData));
      return;
    }
    var _this = this;
    var filePath = this._getPrefFilePath(fileName);
    HexFileMgr.readFileJson(filePath, function(stat, msg, data) {
      var updatedData = _this._initData();
      if (stat == HexFileIoStatus.READ_SUCCESS) {
        if (data != null) {
          updatedData = updatedData.merge(data);
        }
      }

      callback(HexStoreDataHelper.getRes(updatedData));
    });

  },

  _loadPref: function(fileName) {
    if (checker.isWeb()) {
      var updatedData = this._loadFromLocalStorage(fileName);
      return HexStoreDataHelper.getRes(updatedData);
    }

    var updatedData = null;
    var loadedData = null;

    try {
      var filePath = this._getPrefFilePath(fileName);
      loadedData = HexFileMgr.readFileJsonSync(filePath);
    } catch (e) {
      loadedData = null;
    }

    var updatedData = this._initData();
    if (loadedData != null) {
      updatedData = updatedData.merge(loadedData);
    }

    return HexStoreDataHelper.getRes(updatedData);
  },

  _savePref: function(fileName) {
    if (checker.isWeb()) {
      this._saveToLocalStorage(fileName, HexStoreDataMgr.getMap(this._data));
      return;
    }
    var _this = this;
    var filePath = this._getPrefFilePath(fileName);
    HexFileMgr.writeFileJson(
      filePath, HexStoreDataMgr.getMap(this._data), function(stat, msg, data) {
        var isDone = false;
        if (stat == HexFileIoStatus.WRITE_SUCCESS) {
          isDone = true;
        }
        _this.emitSaveDone(isDone);
      });
  },

  _getPrefFilePath: function(fileName) {
    return HexFileMgr.joinPath(
      [HexPathMgr.getAppDataPath(), fileName]);
  },

  _setReady: function() {
    if (this._isReady == false) {
      this._isReady = true;
      this.emitReady();
    }
  }
});

module.exports = HexStore;
