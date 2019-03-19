var remote;
var ipcRenderer;
try {
  remote = global.require('electron').remote;
  ipcRenderer = global.require('electron').ipcRenderer;
} catch (ex) {
  ipcRenderer = null;
  remote = null;
  // Not Supported
}

var HexRemoteActionType = require('../types/hex.remote.action.type');
var HexFileIoStatus = require('../types/hex.file.io.status');
var HexFileMgr = require('./hex.file.mgr.factory').getInstance();
var HexPathMgr = require('./hex.path.mgr.factory').getInstance();
var checker = require('../../core/tools/hex.checker');

var _workspacePath = '';
var _workspaceRestorePath = '';
var _appDataPath = '';
var _resourcePath = '';
var _resDataPath = '';
var _tmpPath = '';
var _basePath = '';
var _resServerIp = '';
var _resWebServerPort = '';

var _resPathFallbackAry = [];
var _dataPathFallbackAry = [];

function checkAndCall(callback, stat, msg, data) {
  if (checker.isFunction(callback)) {
    callback(stat, msg, data);
  }
}

var HexWorkspaceMgr = {

  init: function() {
    _appDataPath = HexPathMgr.getAppDataPath();
    HexFileMgr.ensurePath(_appDataPath);

    _resourcePath = HexPathMgr.getResourcePath();
    HexFileMgr.ensurePath(_resourcePath);
    /*
    _basePath = HexPathMgr.getBasePath();
    _workspacePath = HexPathMgr.getWorkspacePath();
    _tmpPath = HexPathMgr.getTmpPath();
    _workspaceRestorePath = HexPathMgr.getWorkspaceRestorePath();

    HexFileMgr.ensurePath(_workspacePath);
    HexFileMgr.ensurePath(_tmpPath);
    HexFileMgr.ensurePath(_workspaceRestorePath);
    */
  },

  close: function() {
    if (checker.isNonEmptyStr(_basePath)) {
      HexFileMgr.delFolderTreeSync(_basePath, true);
    }
  },

  clear: function() {
    if (checker.isNonEmptyStr(_workspacePath)) {
      HexFileMgr.clearFolder(_workspacePath);
    }
    if (checker.isNonEmptyStr(_tmpPath)) {
      HexFileMgr.clearFolder(_tmpPath);
    }
  },

  importFile: function(filePath, newFileName, callback) {

    var srcFilePath = HexFileMgr.getBasePathFromPath(filePath);
    var srcFileName = HexFileMgr.getFileNameFromPath(filePath);

    // Should be workspace file, but path ignored
    if (srcFilePath == '.' && !HexFileMgr.isFile(filePath)) {
      srcFilePath = _workspacePath;
    }

    var extension = srcFileName.substr(srcFileName.indexOf('.'));
    var newFileNameFull = newFileName + extension;

    HexFileMgr.copyFile(
      srcFileName, srcFilePath, _workspacePath, function(err) {
      if (err == HexFileIoStatus.COPY_SUCCESS) {
        err = undefined;
        callback(err, newFileNameFull);
      } else {
        callback(err);
      }
    }, newFileNameFull);
  },

  deleteFile: function(fileName) {
    var filePath = HexFileMgr.joinPath([_workspacePath, fileName]);
    return HexFileMgr.delFile(filePath);
  },

  getWorkspacePath: function(fileName) {
    return _workspacePath;
  },

  setResServerIp: function(serverIp) {
    _resServerIp = serverIp;
  },

  setResWebServerPort: function(serverPort) {
    _resWebServerPort = serverPort;
  },

  setResourePath: function(path) {
    if (!checker.isNonEmptyStr(path)) {
      return;
    }
    //this.addFallbackResPath(_resourcePath);
    _resourcePath = path;

    if (ipcRenderer != null) {
      ipcRenderer.send(
        HexRemoteActionType.UPDATE_RES_PATH, {path: _resourcePath});
    }

  },

  setResDataPath: function(path) {
    if (!checker.isNonEmptyStr(path)) {
      return;
    }
    _resDataPath = path;
  },

  addFallbackResPath: function(path) {
    if (_resPathFallbackAry.indexOf(path) == -1) {
      _resPathFallbackAry.push(path);

      if (ipcRenderer != null) {
        ipcRenderer.send(
          HexRemoteActionType.ADD_RES_FALLBACK_PATH, {path: _resourcePath});
      }

    }
  },

  addFallbackDataPath: function(path) {
    if (_dataPathFallbackAry.indexOf(path) == -1) {
      _dataPathFallbackAry.push(path);
    }
  },

  clearFallbackResPath: function() {
    _resPathFallbackAry = [];
  },

  clearFallbackDataPath: function() {
    _dataPathFallbackAry = [];
  },

  _ensureServerIp: function(serverIp) {
    var token = serverIp.split(':');
    return token[0];
  },

  getResourcePath: function(fileName) {
    if (checker.isMobile()) {
      var url = '';
      var serverIp = this._ensureServerIp(_resServerIp);
      if (checker.isSsl()) {
        url = 'https://' + serverIp + ':' + _resWebServerPort + '/';
      } else if (checker.isCloudLogin()) {
        url =  'https://' + serverIp + '/';
      }
      else {
        url = 'http://' + serverIp + ':' + _resWebServerPort + '/';
      }

      return url + 'res/' + fileName;
    }else if (checker.isWeb()) {
      return 'res/' + fileName;
    } else {
      return this._getFallbackPath(
        _resourcePath, _resPathFallbackAry, fileName);
    }
  },

  getResDataPath: function(fileName) {
    return this._getFallbackPath(_resDataPath, _dataPathFallbackAry, fileName);
  },

  getAppDataPath: function(fileName) {
    var filePath = HexPathMgr.joinPath(_appDataPath, fileName);
    if (HexFileMgr.isFile(filePath)) {
      return filePath;
    } else {
      return null;
    }
  },

  getAppMediaPath: function(fileName) {
    if (checker.isWeb()) {
      return 'data/media/' + fileName;
    }

    var filePath = HexPathMgr.joinPath(_appDataPath, 'media', fileName);
    if (HexFileMgr.isFile(filePath)) {
      return filePath;
    } else {
      return null;
    }
  },

  _getFallbackPath: function(path, fallbackAry, fileName) {
    if (!checker.isSetNonNull(fileName)) {
      return path;
    }

    var finalPath = this.isResourceValid(path, fileName);
    if (finalPath != null) {
      return finalPath;
    } else {
      // use fallback
      var fallbackPath;
      for (var i = 0; i < fallbackAry.length; i++) {
        fallbackPath = this.isResourceValid(fallbackAry[i], fileName);
        if (fallbackPath != null) {
          return fallbackPath;
        }
      }
    }
    return HexPathMgr.joinPath(path, fileName);
  },

  isResourceValid: function(resPath, fileName) {
    var filePath = HexPathMgr.joinPath(resPath, fileName);
    if (HexFileMgr.isFile(filePath)) {
      return filePath;
    }
    return null;
  },

  getFilePath: function(fileName) {
    return _workspacePath + fileName;
  },

  getTmpPath: function() {
    return _tmpPath;
  },

  archive: function(filePath, callback) {

  },

  restore: function(filePath, callback) {

  }

};

module.exports = HexWorkspaceMgr;
