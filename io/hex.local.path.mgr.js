var checker = require('../../core/tools/hex.checker');
var uuid = require('uuid');
var HexBasePathMgr = require('./hex.base.path.mgr');
var HexFileMgr = require('./hex.file.mgr.factory').getInstance();

var path = require('path');

const MODULE_ID = 'HexLocalPathMgr';

var _appDataPath = null;
var _pathKey = null;
var _fprBasePath = null;
var _tempPath = null;
var _workspacePath = null;
var _workspaceRestorePath = null;
var _resourcePath = null;

// Linux & OSX
var _homePath = '.';

if (global.process) {
  _homePath = global.process.env.HOME;

  if (_homePath == undefined) {
    // Windows
    _homePath = global.process.env.USERPROFILE;
  }
}

var appInfo = null;
try {
  appInfo = global.require('./package.json');
} catch (e) {
  //console.log('Failed to load package.json:' + e.toString());
}

var _appName = 'app';
if (checker.isSetNonNull(appInfo) && checker.isSetNonNull(appInfo.name)) {
  _appName = appInfo.name;
}

initPathName();

function initPathName() {
  _appDataPath = path.join(_homePath, '/' + _appName + '/');

  _pathKey = uuid.v4();
  _fprBasePath = path.join(_appDataPath,  _pathKey);

  while (HexFileMgr.isPath(_fprBasePath)) {
    _pathKey = uuid.v4();
    _fprBasePath = path.join(_appDataPath,  _pathKey);
  }

  _tempPath = path.join(_fprBasePath, '/temp/');
  _workspacePath = path.join(_fprBasePath, '/workspace/');
  _workspaceRestorePath = path.join(_tempPath, '/workspace/');
  _resourcePath = path.join(_appDataPath, '/res/');
}

var HexLocalPathMgr = Object.assign(HexBasePathMgr, {

  setAppId: function(appId) {
      _appName = appId;
      initPathName();
    },

  getBasePath: function() {
    return _fprBasePath;
  },

  getWorkspacePath: function() {
    return _workspacePath;
  },

  getWorkspaceRestorePath: function() {
    return _workspaceRestorePath;
  },

  getResourcePath: function() {
    return _resourcePath;
  },

  getTmpPath: function() {
    return _tempPath;
  },

  getAppDataPath: function() {
    return _appDataPath;
  },

  joinPath: function() {
    var args = Array.prototype.slice.call(arguments);
    return path.join.apply(null, args);
  }

});

HexLocalPathMgr.init(MODULE_ID);
module.exports = HexLocalPathMgr;
