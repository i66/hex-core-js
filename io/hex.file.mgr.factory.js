var checker = require('../../core/tools/hex.checker');
const MODULE_ID = 'HexFileMgrFactory';

var HexFileMgrFactory = {
  getInstance: function() {
    var fileMgr = null;
    if (checker.isMobile()) {
      fileMgr = require('./hex.mobile.file.mgr');
    } else if (checker.isWeb()) {
      fileMgr = require('./hex.web.file.mgr');
    } else {
      fileMgr = require('./hex.local.file.mgr');
    }
    return fileMgr;
  }
};

module.exports = HexFileMgrFactory;
