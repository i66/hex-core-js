var path = require('path');
var checker = require('../tools/hex.checker');
var FprImgIoStatus = require('../constants/fpr.img.io.status');
var FprLocalFileMgr = require('../io/fpr.local.file.mgr');
var FprWorkspaceMgr = require('../io/fpr.workspace.mgr');
var lwip = global.require('pajk-lwip');

function checkAndCall(callback, stat, msg, data) {
  if (checker.isFunction(callback)) {
    if (_isDirectCallback) {
      callback(stat, msg, data);
    }else {
      // Prevent from stack overflow
      setTimeout(function() {
        callback(stat, msg, data);
      }, 0);
    }
  }
}

var _isDirectCallback = false;

var HexImgMgr = {

  isUseDirectCallback: function(isUse) {
    _isDirectCallback = isUse;
  },

  isSupportedFormat: function(filePath, callback) {
    var isError = false;
    var errMsg;
    try {
      lwip.open(filePath, function(err, image) {
        if (err) {
          checkAndCall(callback, FprImgIoStatus.NOT_VALID, err);
        }else {
          checkAndCall(callback, FprImgIoStatus.IS_VALID, '', image);
        }
      });
    }catch (err) {
      isError = true;
      errMsg = err.toString();
    }

    if (isError) {
      checkAndCall(callback, FprImgIoStatus.NOT_VALID, errMsg);
    }

  },

  delete: function(imgFileName) {
    if (checker.isSetNonNull(imgFileName)) {
      var imgPath = path.join(FprWorkspaceMgr.getWorkspacePath(), imgFileName);
      FprLocalFileMgr.delFile(imgPath);
    }
  },

  getDraftPath: function(imgPath) {
    var pathDir = path.dirname(imgPath);
    var extName = path.extname(imgPath);
    var basName = path.basename(imgPath, extName);
    return path.join(
      pathDir, basName + '_draft' + extName);
  },

  convertToPng: function(filePath, dstPath, callback, customFileName) {
    var fileName = FprLocalFileMgr.getFileNameFromPath(filePath);
    if (checker.isSetNonNull(customFileName)) {
      fileName = customFileName;
    }
    var dstFilePath = FprLocalFileMgr.joinPath([
      dstPath,
      FprLocalFileMgr.changeExtension(fileName, 'png')
    ]);

    var isError = false;
    var errMsg;
    try {
      lwip.open(filePath, function(err, image) {
        if (err) {
          checkAndCall(callback, FprImgIoStatus.CONVERT_FAILED, err);
          return;
        }
        image.writeFile(dstFilePath, function(err) {
            if (err) {
              checkAndCall(callback, FprImgIoStatus.CONVERT_FAILED, err);
            }else {
              checkAndCall(callback, FprImgIoStatus.CONVERT_SUCCESS, '');
            }

          });
      });
    }catch (err) {
      isError = true;
      errMsg = err.toString();
    }

    if (isError) {
      checkAndCall(callback, FprImgIoStatus.CONVERT_FAILED, errMsg);
    }
  },

  resize: function(filePath, dstPath, width, height, callback, customFileName) {
    var fileName = FprLocalFileMgr.getFileNameFromPath(filePath);
    if (checker.isSetNonNull(customFileName)) {
      fileName = customFileName;
    }
    var dstFilePath = FprLocalFileMgr.joinPath([
      dstPath, fileName
    ]);

    var isError = false;
    var errMsg;
    try {
      lwip.open(filePath, function(err, image) {
        if (err) {
          checkAndCall(callback, FprImgIoStatus.RESIZE_FAILED, err);
          return;
        }
        image.batch()
          .resize(width, height)
          .writeFile(dstFilePath, function(err) {
            if (err) {
              checkAndCall(callback, FprImgIoStatus.RESIZE_FAILED, err);
            }else {
              checkAndCall(callback, FprImgIoStatus.RESIZE_SUCCESS, '');
            }
          });
      });
    }catch (err) {
      isError = true;
      errMsg = err.toString();
    }

    if (isError) {
      checkAndCall(callback, FprImgIoStatus.RESIZE_FAILED, errMsg);
    }

  },

  crop: function(filePath, dstPath, left, top, width, height,
    callback, customFileName) {
    var fileName = FprLocalFileMgr.getFileNameFromPath(filePath);
    if (checker.isSetNonNull(customFileName)) {
      fileName = customFileName;
    }
    var dstFilePath = FprLocalFileMgr.joinPath([
      dstPath, fileName
    ]);

    if (left < 0) {
      left = 0;
    }

    if (top < 0) {
      top = 0;
    }

    var isError = false;
    var errMsg;
    try {
      lwip.open(filePath, function(err, image) {
        if (err) {
          checkAndCall(callback, FprImgIoStatus.CROP_FAILED, err);
          return;
        }
        image.batch()
          .crop(left, top, left + width - 1, top + height - 1)
          .writeFile(dstFilePath, function(err) {
            if (err) {
              checkAndCall(callback, FprImgIoStatus.CROP_FAILED, err);
            }else {
              checkAndCall(callback, FprImgIoStatus.CROP_SUCCESS, '');
            }
          });
      });
    }catch (err) {
      isError = true;
      errMsg = err.toString();
    }

    if (isError) {
      checkAndCall(callback, FprImgIoStatus.RESIZE_FAILED, errMsg);
    }
  }
};

module.exports = HexImgMgr;
