
var _isChanged = false;
var _curProjFolder = '';
var _curProjFilePath = '';

var EventEmitter = require('events').EventEmitter;
var checker = require('../../core/tools/hex.checker');

var HexWorkspaceMgr = require('./hex.workspace.mgr');
var HexPathMgr = require('./hex.path.mgr.factory').getInstance();

var ID_ACTION_CHANGE = 'ProjChange';
var ID_ACTION_SAVED = 'ProjSaved';

function checkAndCall(callback, stat, msg, data) {
  if (checker.isFunction(callback)) {
    callback(stat, msg, data);
  }
}

function updateProjFilePath(filePath) {
  _curProjFilePath = filePath;
  _curProjFolder = global.require('path').dirname(_curProjFilePath);
}

var HexProjMgr = Object.assign({}, EventEmitter.prototype, {
  init: function() {
    HexWorkspaceMgr.init();
    HexWorkspaceMgr.clear();
  },

  isChanged: function() {
    return _isChanged;
  },

  setChanged: function() {
    _isChanged = true;
    this.emitProjChanged();
  },

  clearChanged: function() {
    _isChanged = false;
    this.emitProjSaved();
  },

  addChangeListener: function(callback) {
    this.on(ID_ACTION_CHANGE, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(ID_ACTION_CHANGE, callback);
  },

  addSaveListener: function(callback) {
    this.on(ID_ACTION_SAVED, callback);
  },

  removeSaveListener: function(callback) {
    this.removeListener(ID_ACTION_SAVED, callback);
  },

  emitProjChanged: function() {
    this.emit(ID_ACTION_CHANGE);
  },

  emitProjSaved: function() {
    this.emit(ID_ACTION_SAVED);
  },

  getCurProjFilePath: function() {
    return _curProjFilePath;
  },

  getProjFolder: function() {
    return checker.isNonEmptyStr(_curProjFolder) ?
      _curProjFolder : HexPathMgr.getAppDataPath();
  },

  closeProj: function() {
    console.log('close proj');
    HexWorkspaceMgr.close();
  },

  newProj: function() {
    console.log('new proj');
    _curProjFilePath = '';
    HexWorkspaceMgr.clear();
  },

  loadProj: function(filePath, callback) {

  },

  saveProj: function(filePath, data, callback) {

  },
});

module.exports = HexProjMgr;
