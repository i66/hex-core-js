var checker = require('../../core/tools/hex.checker');
var uuid = require('uuid');
var HexBasePathMgr = require('./hex.base.path.mgr');
var HexFileMgr = require('./hex.file.mgr.factory').getInstance();

const MODULE_ID = 'HexMobilePathMgr';

function join() {
  var args = [].slice.call(arguments);
  return args.join('/');
}

var _appPath = null;
var _homePath = null;
var _appName = 'app';

var _appDataPath = null;

var _pathKey = uuid.v4();
var _fprBasePath = join(_appDataPath,  _pathKey);

while (HexFileMgr.isPath(_fprBasePath)) {
  _pathKey = uuid.v4();
  _fprBasePath = join(_appDataPath,  _pathKey);
}

var _tempPath = join(_fprBasePath, '/temp/');
var _workspacePath = join(_fprBasePath, '/workspace/');
var _workspaceRestorePath = join(_tempPath, '/workspace/');
var _resourcePath = join(_appDataPath, '/res/');

var HexMobilePathMgr = Object.assign(HexBasePathMgr, {


  initAppPath: function(callback) {
    _appPath = cordova.file.applicationDirectory;
    _homePath = cordova.file.dataDirectory;

    var _this = this;
    cordova.getAppVersion.getPackageName(function(pkgname) {
      _appName = pkgname;
      _appDataPath = _appName;
      _this.emitReady();
    });

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
    return _appName;
  },

  joinPath: function() {
    var args = Array.prototype.slice.call(arguments);
    return join.apply(null, args);
  },

  splitPath: function(path) {
    return path.split('/');
  },

  getFilePath: function(path) {
    var tokens = this.splitPath(path);
    return join.apply(null, tokens.splice(tokens.length - 1, 1));
  },

  getFileName: function(path) {
    var tokens = this.splitPath(path);
    return tokens.pop();
  },

  prepare: function() {
    this.initAppPath();
  }

});

HexMobilePathMgr.init(MODULE_ID);
module.exports = HexMobilePathMgr;
