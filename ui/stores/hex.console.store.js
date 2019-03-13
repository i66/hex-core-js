var HexActionType = require('../types/hex.action.type');
var HexStoreDataHelper = require('./hex.store.data.helper');
var HexAppConstant = require('../types/hex.app.constant');
var HexStore = require('./hex.store');

var logger = require('../../core/tools/hex.logger');

const MODULE_ID = 'HexConsoleStore';
const ID_ACTION_CHANGE = HexActionType.LOG_CHANGE;
const ID_ACTION_TOGGLE = HexActionType.TOGGLE_CONSOLE;
const ID_ACTION_CLEAR = HexActionType.LOG_CLEAR;
const MAX_LOG  = HexAppConstant.MAX_LOG;

var HexConsoleStore = Object.assign({}, HexStore, {

  clear: function() {
    this._data = this._initData();
    this.emitChange();
  },

  _getAll: function() {
    return this._data.slice(0);
  },

  _initData: function() {
    return [];
  },
  _initAction: function() {
    logger.register(this._onLogData.bind(this));
    logger.setLogConsole(false);
    this._actionHelper.registerAction(
      ID_ACTION_TOGGLE, this._handleToggle);
    this._actionHelper.registerAction(
      ID_ACTION_CLEAR, this._handleClear);
  },

  _handleToggle: function(storeData, method, data) {
    this.emitEvent(ID_ACTION_TOGGLE);
    // Nothing to update
    return null;
  },

  _handleClear: function(storeData, method, data) {
    this._data = this._initData();
    this.emitChange();
    return null;
  },

  _handleResetStore: function() {
    return null;
  },

  _onLogData: function(payload) {
    this._data.push(payload);
    // Remove top-most log
    if (this._data.length > MAX_LOG) {
      this._data.splice(0, 1);
    }
    this.emitChange();
  }
});

HexConsoleStore.init(MODULE_ID, ID_ACTION_CHANGE);

module.exports = HexConsoleStore;

/*
var GokuActionType = require('../types/goku.action.type');
var GokuEventType = require('../types/goku.event.type');

var GokuAppDispatcher = require('../dispatcher/goku.app.dispatcher');


var moduleId = 'GokuConsoleStore';
var registerId = '';

var maxLog = GokuAppConst.MAX_LOG;

var _data = [];



var GokuConsoleStore = Object.assign({}, EventEmitter.prototype, {

  getAll: function() {
    return Object.assign({}, {log:_data});
  },

  emitChange: function() {
    this.emit(GokuEventType.LOG_UPDATED);
  },

  emitToggle: function() {
    this.emit(GokuEventType.LOG_TOGGLE);
  },

  addToggleListener: function(callback, targetId) {
    this.on(GokuEventType.LOG_TOGGLE, callback);
    logger.info('AddToggleListener: ' + targetId, moduleId);
  },

  removeToggleListener: function(callback, targetId) {
    this.removeListener(GokuEventType.LOG_TOGGLE, callback);
    logger.info('RemoveToggleListener: ' + targetId, moduleId);
  },

  addChangeListener: function(callback, targetId) {
    this.on(GokuEventType.LOG_UPDATED, callback);
    logger.info('AddChangeListener: ' + targetId, moduleId);
  },

  removeChangeListener: function(callback, targetId) {
    this.removeListener(GokuEventType.LOG_UPDATED, callback);
    logger.info('RemoveChangeListener: ' + targetId, moduleId);
  }

});

function onLogData(payload){
  _data.push(payload);
  // Remove top-most log
  if(_data.length > maxLog){
    _data.splice(0, 1);
  }
  GokuConsoleStore.emitChange();
}

function handleAction(action){
  if(action.actionType ==  GokuActionType.TOGGLE_CONSOLE){
    GokuConsoleStore.emitToggle();
  }
}

registerId = logger.register(onLogData);
// Register callback to handle all updates
GokuAppDispatcher.register(handleAction);

module.exports = GokuConsoleStore;
*/
