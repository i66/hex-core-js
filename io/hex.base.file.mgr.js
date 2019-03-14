var EventEmitter = require('events').EventEmitter;

var checker = require('../../core/tools/hex.checker');
var logger = require('../../core/tools/hex.logger');

// Constants and Types
var HexActionType = require('../types/hex.action.type');
var HexFileIoStatus = require('../types/hex.file.io.status');

const MODULE_ID = 'HexBaseFileMgr';

var ID_ACTION_READY = HexActionType.READY;

var HexBaseFileMgr = Object.assign({}, EventEmitter.prototype, {

  getId: function() {
    return this._getId();
  },

  init: function() {

  },

  readFileUTF8: function(filePath, callback) {

  },

  readFileUTF8Sync: function(filePath) {

  },

  writeFileUTF8: function(filePath, data, callback) {

  },

  readFileJson: function(filePath, callback) {

  },

  readFileJsonSync: function(filePath) {

  },

  writeFileJson: function(filePath, data, callback) {

  },

  listFileInFolder: function(folderPath, callback) {

  },

  listFileInFolderMatch: function(folderPath, matchPatten) {

  },

  listFileInFolderSync: function(folderPath) {

  },

  listFolderInFolderSync: function(folderPath) {

  },

  isFile: function(filePath) {

  },

  isPath: function(filePath) {

  },

  copyFile: function(fileName, srcPath, dstPath, callbackCopyFile) {

  },

  renameFile: function(srcPath, dstPath, callback) {

  },

  delFile: function(filePath) {

  },

  delPath: function(folderPath) {

  },

  ensurePath: function(folderPath) {

  },

  delFolder: function(folderPath, callback) {

  },

  clearFolder: function(folderPath, callback) {

  },

  delFolderTreeSync: function(folderPath, isDeleteFolder) {

  },

  delFolderTree: function(folderPath, isDeleteFolder, callback) {

  },

  copyFolderContent: function(dirPath, dstPath, callbackFunc, isDirectCall) {

  },

  copyFileList: function(files, dirPath, dstPath, callback, isDirectCall) {

  },

  zipFolder: function(dirPath, filePath, callback, isDirectCall) {

  },

  unzipFolder: function(filePath, dirPath, callback, isDirectCall) {

  },

  getFileNameFromPath: function(filePath) {

  },

  getBasePathFromPath: function(filePath) {

  },

  joinPath: function(partAry) {

  },

  changeExtension: function(filePath, ext) {

  },

  ensurePackagePath: function(packagePath) {

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

  _getId: function() {
    return this._id;
  },

  _checkAndCall: function(callback, stat, msg, data) {
    if (checker.isFunction(callback)) {
      // Prevent from stack overflow
      setTimeout(function() {
        callback(stat, msg, data);
      }, 0);
    }
  },

  _checkAndCallDirect: function(callback, stat, msg, data) {
    if (checker.isFunction(callback)) {
      callback(stat, msg, data);
    }
  }

});

module.exports = HexBaseFileMgr;
