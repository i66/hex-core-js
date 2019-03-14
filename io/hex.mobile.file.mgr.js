var checker = require('../../core/tools/hex.checker');
var logger = require('../../core/tools/hex.logger');
var HexFileIoStatus = require('../types/hex.file.io.status');
var HexBaseFileMgr = require('./hex.base.file.mgr');

const MODULE_ID = 'HexMobileFileMgr';
const PACKAGE_ROOT = 'app/';

function join() {
  var args = [].slice.call(arguments);
  return args.join('/');
}

var addError = function(error) {
  console.error('getDirectory error: ' + error.code);
};

var HexMobileFileMgr = Object.assign(HexBaseFileMgr, {

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
    var _this = this;

    if (filePath.indexOf('file://') != 0) {
      filePath = join(cordova.file.dataDirectory, filePath);
    }

    window.resolveLocalFileSystemURL(filePath, function(fileEntry) {
      fileEntry.file(function(file) {
        var reader = new FileReader();
        reader.onloadend = function(e) {

          var obj;
          var isDone = false;
          var msg = '';
          try {
            obj = JSON.parse(this.result);
            isDone = true;
          }catch (err) {
            msg = err.toString();
          }

          if (isDone) {
            _this._checkAndCall(
              callback, HexFileIoStatus.READ_SUCCESS, '', obj);
          }else {
            _this._checkAndCall(
              callback, HexFileIoStatus.JSON_PARSE_FAILED, msg);
          }
        };

        // Call Read
        reader.readAsText(file);
      });
    }, function(error) {
      _this._checkAndCall(callback, HexFileIoStatus.READ_FAILED, error.code);
    });
  },

  readFileJsonSync: function(filePath) {
    var data = {};

    return data;
  },

  writeFileJson: function(filePath, data, callback) {
    var buffer;
    var msg = '';
    var isDone = false;

    try {
      buffer = JSON.stringify(data,  null, 4);
      isDone = true;
    }catch (err) {
      msg = err.toString();
    }

    if (isDone) {

      //var finalPath = join(HexPathMgr.getAppDataPath(), filePath);
      var pathDir = this.getFilePath(filePath);
      var fileName = this.getFileName(filePath);
      var _this = this;
      this.ensureDataPath(pathDir,
        function() {
          // Folder Success
          window.resolveLocalFileSystemURL(
            join(cordova.file.dataDirectory, pathDir),
            function(dirEntry) {
              _this.createAndWriteFile(dirEntry, fileName, buffer, false,
              function() {
                _this._checkAndCall(
                  callback, HexFileIoStatus.WRITE_SUCCESS);
              },
              function(msg) {
                _this._checkAndCall(
                  callback, HexFileIoStatus.WRITE_FAILED, msg);
              }
            );
            }, function(error) {
              _this._checkAndCall(
                callback, HexFileIoStatus.PATH_FAILED, error.code);
            });
        },
        function(error) {
          // Folder Fail
          _this._checkAndCall(
            callback, HexFileIoStatus.PATH_FAILED, error.code);
        }
      );

    }else {
      _this._checkAndCall(
        callback, HexFileIoStatus.JSON_PARSE_FAILED, msg);
    }

  },

  createAndWriteFile:
  function(dirEntry, fileName, data, isAppend, cbSuccess, cbFail) {
    var _this = this;
    // Creates a new file or returns the file if it already exists.
    dirEntry.getFile(fileName, {create: true, exclusive: false},
      function(fileEntry) {

        _this.writeFile(fileEntry, data, cbSuccess, cbFail);

      }, cbFail);
  },

  writeFile: function(fileEntry, dataObj, cbSuccess, cbFail) {
      // Create a FileWriter object for our FileEntry (log.txt).
      fileEntry.createWriter(function(fileWriter) {

        fileWriter.onwriteend = function() {
            cbSuccess();
          };

        fileWriter.onerror = function(e) {
          cbFail(e.toString());
        };
        // Write!
        fileWriter.write(dataObj);
      });
    },

  createDirectory: function(fileEntry, folderList, cbSuccess, cbFail) {
    if (folderList.length == 0) {
      cbSuccess();
      return;
    }
    var folderName = folderList.shift();
    var _this = this;
    fileEntry.getDirectory(folderName, {create: true},
      function(dirEntry) {
        _this.createDirectory(dirEntry, folderList, cbSuccess, cbFail)
      }, cbFail);
  },

  ensureDataPath: function(path, cbSuccess, cbFail) {

    var _this = this;
    window.resolveLocalFileSystemURL(cordova.file.dataDirectory,
      function(entry) {
        var tokens = _this.splitPath(path);
        _this.createDirectory(entry, tokens, cbSuccess, cbFail);
      }
    );

  },

  listFileInFolder: function(folderPath, callback) {
    var _this = this;
    window.resolveLocalFileSystemURL(folderPath,
      function(entry) {
        var dirReader = entry.createReader();
        dirReader.readEntries(
          function(entries) {
            var files = [];
            var i;
            for (i = 0; i < entries.length; i++) {
              if (entries[i].isDirectory === true) {
                // Recursive -- call back into this subdirectory
                // addFileEntry(entries[i]);
              } else {
                files.push(entries[i].name);
              }
            }
            _this._checkAndCall(
              callback, HexFileIoStatus.LIST_SUCCESS, '', files);
          },
          function(error) {
            _this._checkAndCall(
              callback, HexFileIoStatus.LIST_FAILED, error.code);
          }
        );
      },
      function(error) {
        _this._checkAndCall(
          callback, HexFileIoStatus.LIST_FAILED, error.code);
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
    this.ensureDataPath(folderPath,
      function() {
        console.log('SUCCESS!');
      },
      function() {
        console.log('FAILED');
      }
    );
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
    var APP_ROOT = cordova.file.applicationDirectory + 'www/';
    return APP_ROOT + packagePath.replace(PACKAGE_ROOT, '');
  },

  splitPath: function(path) {
    return path.split('/');
  },

  getFilePath: function(path) {
    var tokens = this.splitPath(path);
    return join.apply(null, tokens.slice(0, tokens.length - 1));
  },

  getFileName: function(path) {
    var tokens = this.splitPath(path);
    return tokens.pop();
  }

});

module.exports = HexMobileFileMgr;
