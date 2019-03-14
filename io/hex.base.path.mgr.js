var EventEmitter = require('events').EventEmitter;

var checker = require('../../core/tools/hex.checker');

var EboxUiDispatcher = require('../dispatcher/hex.dispatcher');
// Constants and Types
var HexActionType = require('../types/hex.action.type');

const MODULE_ID = 'HexBasePathMgr';

var ID_ACTION_READY = HexActionType.READY;
var ID_ACTION_INIT = HexActionType.APP_INIT;

var HexBasePathMgr = Object.assign({}, EventEmitter.prototype, {


  setAppId: function(appId) {

  },

  getId: function() {
    return this._getId();
  },

  init: function(id) {
    this._id = id;
    //EboxUiDispatcher.register(this._handleEvent.bind(this));
    this._initDetail();
  },

  getBasePath: function() {

  },

  getWorkspacePath: function() {

  },

  getWorkspaceRestorePath: function() {

  },

  getResourcePath: function() {

  },

  getTmpPath: function() {

  },

  getAppDataPath: function() {

  },

  joinPath: function() {

  },

  addReadyListener: function(callback) {
    this.on(ID_ACTION_READY, callback);
  },

  removeReadyListener: function(callback) {
    this.removeListener(ID_ACTION_READY, callback);
  },

  emitReady: function() {
    this.emit(ID_ACTION_READY, this._id);
  },

  _handleEvent: function(param) {
    if (param.actionType == ID_ACTION_INIT) {
      this._onAppInit();
    }
  },

  _getId: function() {
    return this._id;
  },

  _onAppInit: function() {
    _this.emitReady();
  },

  _initDetail: function() {

  },

  prepare: function() {

  }

});

module.exports = HexBasePathMgr;
