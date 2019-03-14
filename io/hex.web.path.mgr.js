var checker = require('../../core/tools/hex.checker');

var uuid = require('uuid');
var HexFileMgr = require('./hex.file.mgr.factory').getInstance();

var HexWebPathMgr = {
  
  init: function() {

  },

  getBasePath: function() {
    return null;
  },

  getWorkspacePath: function() {
    return null;
  },

  getWorkspaceRestorePath: function() {
    return null;
  },

  getResourcePath: function() {
    return null;
  },

  getTmpPath: function() {
    return null;
  },

  getAppDataPath: function() {
    return '';
  },

  joinPath: function() {
    var args = Array.prototype.slice.call(arguments);
    return args.join('/');
  }
};

module.exports = HexWebPathMgr;
