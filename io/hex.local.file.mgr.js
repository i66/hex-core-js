var checker = require('../../core/tools/hex.checker');
var logger = require('../../core/tools/hex.logger');
var HexFileIoStatus = require('../types/hex.file.io.status');
var HexBaseFileMgr = require('./hex.base.file.mgr');

var fs = require('fs');
var path = require('path');

const MODULE_ID = 'HexLocalFileMgr';

var HexLocalFileMgr = Object.assign(HexBaseFileMgr, {

  init: function() {

  },

  readFileUTF8: function(filePath, callback) {
    logger.info('readFileUTF8: ' + filePath, MODULE_ID);
    var isDone = false;
    var msg = '';
    var buffer;
    try {
      buffer = fs.readFileSync(filePath, 'utf8');
      isDone = true;
    }catch (err) {
      msg = err.toString();
    }

    if (isDone) {
      this._checkAndCall(callback, HexFileIoStatus.READ_SUCCESS, msg, buffer);
    }else {
      this._checkAndCall(callback, HexFileIoStatus.READ_FAILED, msg);
    }
  },

  readFileUTF8Sync: function(filePath) {
    logger.info('readFileUTF8Sync: ' + filePath, MODULE_ID, logger.DEBUG);
    var buffer = null;
    try {
      buffer = fs.readFileSync(filePath, 'utf8');
    }catch (err) {
      console.log(err.toString());
    }
    return buffer;
  },

  writeFileUTF8: function(filePath, data, callback) {
    logger.info('writeFileUTF8: ' + filePath, MODULE_ID, logger.DEBUG);
    var isDone = false;
    var msg = '';
    try {
      fs.writeFileSync(filePath, data, 'utf8');
      isDone = true;
    }catch (err) {
      msg = err.toString();
      logger.error('writeFileUTF8 Failed: ',
        err, MODULE_ID, logger.DEBUG);
    }

    if (isDone) {
      this._checkAndCall(callback, HexFileIoStatus.WRITE_SUCCESS, msg);
    }else {
      this._checkAndCall(callback, HexFileIoStatus.WRITE_FAILED, msg);
    }
    //return isDone ? null : msg;
  },

  readFileJson: function(filePath, callback) {
    var _this = this;
    HexLocalFileMgr.readFileUTF8(filePath, function(stat, msg, data) {
      if (stat == HexFileIoStatus.READ_SUCCESS) {
        var obj;
        var isDone = false;
        var msg = '';
        try {
          obj = JSON.parse(data);
          isDone = true;
        }catch (err) {
          msg = err.toString();
        }

        if (isDone) {
          _this._checkAndCall(callback, HexFileIoStatus.READ_SUCCESS, '', obj);
        }else {
          _this._checkAndCall(callback, HexFileIoStatus.JSON_PARSE_FAILED, msg);
        }
      }else {
        _this._checkAndCall(callback, stat, msg);
      }
    });
  },

  readFileJsonSync: function(filePath) {
    var buffer = this.readFileUTF8Sync(filePath);
    var obj = null;
    try {
      obj = JSON.parse(buffer);
    }catch (err) {
      logger.warn(err.toString(), MODULE_ID);
    }
    return obj;
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
      var _this = this;
      HexLocalFileMgr.writeFileUTF8(filePath, buffer,
      function(stat, msg, data) {
        _this._checkAndCall(callback, stat, msg);
      });
    }else {
      this._checkAndCall(callback, HexFileIoStatus.JSON_PARSE_FAILED, msg);
    }

  },

  listFileInFolder: function(folderPath, callback) {
    var isDone = false;
    var msg = '';
    var files;
    try {
      files = fs.readdirSync(folderPath);
      isDone = true;
    }catch (err) {
      msg = err.toString();
    }

    if (isDone) {
      this._checkAndCall(callback, HexFileIoStatus.LIST_SUCCESS, msg, files);
    }else {
      this._checkAndCall(callback, HexFileIoStatus.LIST_FAILED, msg);
    }
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
    var isDone = false;
    var msg = '';
    var files = null;
    try {
      files = fs.readdirSync(folderPath);
      isDone = true;
    }catch (err) {
      msg = err.toString();
    }

    return files;
  },

  listFolderInFolderSync: function(folderPath) {
    var isDone = false;
    var msg = '';
    var files = null;
    try {
      files = fs.readdirSync(folderPath).filter(function(file) {
        return fs.statSync(path.join(folderPath, file)).isDirectory();
      });
      isDone = true;
    }catch (err) {
      msg = err.toString();
    }

    return files;
  },

  isFile: function(filePath) {
    try {
      return fs.statSync(filePath).isFile();
    }catch (err) {
      return false;
    }
  },

  isPath: function(filePath) {
    try {
      return fs.statSync(filePath).isDirectory();
    }catch (err) {
      return false;
    }
  },

  copyFile: function(fileName, srcPath, dstPath, callbackCopyFile) {
    var isDone = false;
    var msg = '';
    var _this = this;
    try {
      var streamIn = fs.createReadStream(srcPath + '/' + fileName);

      streamIn.on('error', function(err) {
        _this._checkAndCallDirect(callbackCopyFile,
          HexFileIoStatus.COPY_FAILED, err.toString());
      });

      var streamOut = fs.createWriteStream(dstPath + '/' + fileName);

      streamOut.on('error', function(err) {
        _this._checkAndCallDirect(callbackCopyFile,
          HexFileIoStatus.COPY_FAILED, err.toString());
      });

      var steam = streamIn.pipe(streamOut);

      steam.on('finish', function() {
        _this._checkAndCallDirect(
          callbackCopyFile, HexFileIoStatus.COPY_SUCCESS, '');
      });

      isDone = true;
    }catch (err) {
      msg = err.toString();
    }

    if (isDone == false) {
      this._checkAndCallDirect(callbackCopyFile, HexFileIoStatus.COPY_FAILED, msg);
    }

  },

  renameFile: function(srcPath, dstPath, callback) {
    fs.rename(srcPath, dstPath, function(err) {
      callback(err);
    });
  },

  delFile: function(filePath) {
    try {
      fs.unlinkSync(filePath);
      return true;
    } catch (err) {
      return err;
    }
  },

  delPath: function(folderPath) {
    try {
      fs.rmdirSync(folderPath);
      return true;
    } catch (err) {
      return err;
    }
  },

  ensurePath: function(folderPath) {
    var mkdirp = global.require('mkdirp');
    mkdirp.sync(folderPath);
  },

  delFolder: function(folderPath, callback) {
    this.delFolderTree(folderPath, true, callback);
  },

  clearFolder: function(folderPath, callback) {
    //this.delFolderTree(folderPath, false, callback);
    this.delFolderTreeSync(folderPath, false);
    this._checkAndCall(callback, HexFileIoStatus.DELETE_SUCCESS, '');
  },

  delFolderTreeSync: function(folderPath, isDeleteFolder) {
    var _this = this;
    if (fs.existsSync(folderPath)) {
      fs.readdirSync(folderPath).forEach(function(file, index) {
        var curPath = folderPath + '/' + file;
        if (fs.lstatSync(curPath).isDirectory()) { // recurse
          _this.delFolderTreeSync(curPath, true);
        } else { // delete file
          fs.unlinkSync(curPath);
        }
      });
      if (isDeleteFolder) {
        fs.rmdirSync(folderPath);
      }
    }
  },

  delFolderTree: function(folderPath, isDeleteFolder, callback) {
    var _this = this;
    this.listFileInFolder(folderPath, function(stat, msg, files) {
      if (stat == HexFileIoStatus.LIST_SUCCESS) {
        logger.info('delFolderTree: ' + folderPath + ', Del:' +
        isDeleteFolder + ', ' + files.length, MODULE_ID);
        for (var i = 0; i < files.length; i++) {
          var filePath = folderPath + '/' + files[i];
          if (HexLocalFileMgr.isFile(filePath)) {
            console.log('delFolderTree: ' + filePath);
            HexLocalFileMgr.delFile(filePath);
          } else {
            HexLocalFileMgr.delFolderTree(filePath, true);
          }
        }
        if (isDeleteFolder == true) {
          HexLocalFileMgr.delPath(folderPath);
        }
        _this._checkAndCall(callback, HexFileIoStatus.DELETE_SUCCESS, '');
      } else {
        _this._checkAndCall(callback, HexFileIoStatus.DELETE_FAILED, msg);
      }
    });
  },

  copyFolderContent: function(dirPath, dstPath, callbackFunc, isDirectCall) {
    var _this = this;
    this.listFileInFolder(dirPath, function(stat, msg, files) {
      if (stat == HexFileIoStatus.LIST_SUCCESS) {
        var totalFile = 0;
        var numFileDone = 0;
        var isError = false;
        logger.info('copyFolderContent: ' + dirPath + ' ->' + dstPath + ', ' +
          files.length, MODULE_ID);
        for (var i = 0; i < files.length; i++) {
          if (isError == true) {
            return;
          }
          var filePath = dirPath + '/' + files[i];
          logger.info('copyFolderContent: ' + filePath, MODULE_ID);
          if (HexLocalFileMgr.isFile(filePath)) {
            totalFile++;
            HexLocalFileMgr.copyFile(files[i], dirPath, dstPath,
              function(stat, msg) {
              if (stat == HexFileIoStatus.COPY_SUCCESS) {
                numFileDone++;
                console.log(numFileDone + '/' + totalFile + ' DONE!');
                if (numFileDone >= totalFile) {
                  if (isDirectCall == true) {
                    _this._checkAndCallDirect(
                      callbackFunc, HexFileIoStatus.COPY_SUCCESS);
                  }else {
                    _this._checkAndCall(
                      callbackFunc, HexFileIoStatus.COPY_SUCCESS);
                  }
                }
              }else {
                if (isError == false) {
                  isError = true;
                  if (isDirectCall == true) {
                    _this._checkAndCallDirect(callbackFunc,
                      HexFileIoStatus.COPY_FAILED, msg);
                  }else {
                    _this._checkAndCall(callbackFunc,
                      HexFileIoStatus.COPY_FAILED, msg);
                  }
                }
              }
            });
          }
        }
      }else {
        if (isDirectCall == true) {
          _this._checkAndCallDirect(
            callbackFunc, HexFileIoStatus.COPY_FAILED, msg);
        }else {
          _this._checkAndCall(callbackFunc, HexFileIoStatus.COPY_FAILED, msg);
        }
      }
    });
  },

  copyFileList: function(files, dirPath, dstPath, callback, isDirectCall) {
    var totalFile = 0;
    var numFileDone = 0;
    var isError = false;
    var _this = this;
    logger.info('copyFileList: ' + files + ' ->' + dstPath + ', ' +
      files.length, MODULE_ID);
    for (var i = 0; i < files.length; i++) {
      if (isError == true) {
        return;
      }
      var filePath = dirPath + '/' + files[i];
      logger.info('copyFileList: ' + filePath, MODULE_ID);
      if (HexLocalFileMgr.isFile(filePath)) {
        totalFile++;
        HexLocalFileMgr.copyFile(files[i], dirPath, dstPath,
          function(stat, msg) {
          if (stat == HexFileIoStatus.COPY_SUCCESS) {
            numFileDone++;
            console.log(numFileDone + '/' + totalFile + ' DONE!');
            if (numFileDone >= totalFile) {
              if (isDirectCall == true) {
                _this._checkAndCallDirect(
                  callback, HexFileIoStatus.COPY_SUCCESS);
              }else {
                _this._checkAndCall(callback, HexFileIoStatus.COPY_SUCCESS);
              }
            }
          }else {
            if (isError == false) {
              isError = true;
              if (isDirectCall == true) {
                _this._checkAndCallDirect(callback,
                  HexFileIoStatus.COPY_FAILED, msg);
              }else {
                _this._checkAndCall(callback,
                  HexFileIoStatus.COPY_FAILED, msg);
              }
            }
          }
        });
      }
    }
  },

  zipFolder: function(dirPath, filePath, callback, isDirectCall) {
    var _this = this;
    var zipFolderFunc = global.require('zip-folder');
    zipFolderFunc(dirPath, filePath, function(err) {
      if (err) {
        if (isDirectCall == true) {
          _this._checkAndCallDirect(callback,
            HexFileIoStatus.ZIP_FAILED, err.toString());
        }else {
          _this._checkAndCall(
            callback, HexFileIoStatus.ZIP_FAILED, err.toString());
        }
      }else {
        if (isDirectCall == true) {
          _this._checkAndCallDirect(
            callback, HexFileIoStatus.ZIP_SUCCESS, '');
        }else {
          _this._checkAndCall(
            callback, HexFileIoStatus.ZIP_SUCCESS, '');
        }
      }
    });
  },

  unzipFolder: function(filePath, dirPath, callback, isDirectCall) {
    var _this = this;
    var extractZip = global.require('extract-zip');
    extractZip(filePath, {dir: dirPath}, function(err) {
      if (!checker.isSetNonNull(err)) {
        if (isDirectCall == true) {
          _this._checkAndCallDirect(callback, HexFileIoStatus.ZIP_SUCCESS, '');
        }else {
          _this._checkAndCall(callback, HexFileIoStatus.ZIP_SUCCESS, '');
        }
      }else {
        if (isDirectCall == true) {
          _this._checkAndCallDirect(callback,
            HexFileIoStatus.ZIP_FAILED, err.toString());
        }else {
          _this._checkAndCall(
            callback, HexFileIoStatus.ZIP_FAILED, err.toString());
        }
      }
    });
  },

  getFileNameFromPath: function(filePath) {
    return path.basename(filePath);
  },

  getBasePathFromPath: function(filePath) {
    return path.dirname(filePath);
  },

  joinPath: function(partAry) {
    return path.join.apply(null, partAry);
  },

  changeExtension: function(filePath, ext) {
    var parts = path.parse(filePath);
    parts.ext = ext == '' ? ext : '.' + ext;
    return this.joinPath([
      parts.dir,
      parts.name + parts.ext
    ]);
  },

  ensurePackagePath: function(packagePath) {
    if (!this.isPath(packagePath)) {
      if (global.process.resourcesPath) {
        packagePath = path.join(global.process.resourcesPath, packagePath);
      } else {
        // NW.JS
        var curRunPath = global.process.cwd();
        if (curRunPath.indexOf('Temp') == -1) {
          // Run from NW
          packagePath = path.join(global.process.cwd(), '../',  packagePath);
        } else {
          // Run NW-Built binary
          packagePath = path.join(
            global.process.cwd(),
            packagePath.replace('app/', ''));
        }

      }
    }
    return packagePath;
  }

});

module.exports = HexLocalFileMgr;
