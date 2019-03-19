var checker = require('../../core/tools/hex.checker');
var logger = require('../../core/tools/hex.logger');
var HexFileIoStatus = require('../types/hex.file.io.status');
var HexBaseFileMgr = require('./hex.base.file.mgr');

const MODULE_ID = 'HexWebFileMgr';

const PACKAGE_ROOT = 'app/';
const WEB_ROOT = '/';

var HexWebFileMgr = Object.assign(HexBaseFileMgr, {

  init: function() {

  },

  readFileUTF8: function(filePath, callback) {
    logger.info('readFileUTF8: ' + filePath, MODULE_ID);

  },

  readFileUTF8Sync: function(filePath) {
    logger.info('readFileUTF8Sync: ' + filePath, MODULE_ID, logger.DEBUG);
    var buffer = null;
    return buffer;
  },

  writeFileUTF8: function(filePath, data, callback) {
    logger.info('writeFileUTF8: ' + filePath, MODULE_ID, logger.DEBUG);
  },

  readFileJson: function(filePath, callback) {
    var data = {};
    var msg = null;
    var _this = this;
    $.ajax({
      url: filePath
    }).done(function(res) {
      var isDone = false;
      var data = null;
      if (checker.isObj(res)) {
        data = res;
        isDone = true;
      } else {
        // Parse
        try {
          var data = JSON.parse(res);
          isDone = true;
        }catch (err) {
          msg = err.toString();
        }
      }

      if (isDone == true) {
        _this._checkAndCall(
          callback, HexFileIoStatus.READ_SUCCESS, '', data);
      } else {
        _this._checkAndCall(
          callback, HexFileIoStatus.JSON_PARSE_FAILED, msg);
      }

    }).fail(function(jqXHR, msg) {
      _this._checkAndCall(
        callback, HexFileIoStatus.READ_FAILED, msg);
    });
  },

  readFileJsonSync: function(filePath) {
    var data = {};
    var msg = null;
    $.ajax({
      url: filePath,
      async: false
    }).done(function(res) {
      try {
        data = res;
      }catch (err) {
        msg = err.toString();
      }
    });

    if (msg != null) {
      console.log(msg);
    }

    return data;
  },

  writeFileJson: function(filePath, data, callback) {
    var data = {};
    var msg = null;
    $.ajax({
      url: filePath,
      async: false
    }).done(function(res) {
      try {
        data = res;
      }catch (err) {
        msg = err.toString();
      }
    });

    if (msg != null) {
      console.log(msg);
    }

    return data;
  },

  listFileInFolder: function(folderPath, callback) {
    var data = {};
    var msg = null;
    var _this = this;
    $.ajax({
      url: folderPath
    }).done(function(res) {
      var isDone = false;
      var files = [];
      try {
        var data = JSON.parse(res);
        files = data.result;
        isDone = true;
      }catch (err) {
        msg = err.toString();
      }

      if (isDone == true) {
        _this._checkAndCall(
          callback, HexFileIoStatus.LIST_SUCCESS, '', files);
      } else {
        _this._checkAndCall(
          callback, HexFileIoStatus.JSON_PARSE_FAILED, msg);
      }
    }).fail(function(jqXHR, msg) {
      _this._checkAndCall(
        callback, HexFileIoStatus.LIST_FAILED, msg);
    });
  },

  listFileInFolderMatch: function(folderPath, matchPatten) {
    var files = this.listFileInFolderSync(folderPath);
    if (files == null) {
      return null;
    }
    var resList = [];
    var curFile;
    for (var i = 0; i < files.length; i++) {
      curFile = files[i];
      if (curFile.indexOf(matchPatten) != -1) {
        resList.push(curFile);
      }
    }
    return resList;
  },

  listFileInFolderSync: function(folderPath) {
    var files = [];
    var msg = null;
    $.ajax({
      url: folderPath,
      async: false
    }).done(function(res) {
      try {
        var data = JSON.parse(res);
        files = data.result;
      }catch (err) {
        msg = err.toString();
      }
    });

    if (msg != null) {
      console.log(msg);
    }
    return files;
  },

  listFolderInFolderSync: function(folderPath) {
    var isDone = false;
    var msg = '';
    var files = [];
    return files;
  },

  isFile: function(filePath) {
    return false;
  },

  isPath: function(filePath) {
    return false;
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
    return partAry.join('/');
  },

  changeExtension: function(filePath, ext) {

  },

  ensurePackagePath: function(packagePath) {
    return packagePath.replace(PACKAGE_ROOT, WEB_ROOT);
  }

});

module.exports = HexWebFileMgr;
