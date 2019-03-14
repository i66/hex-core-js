var checker = require('../../core/tools/hex.checker');
const MODULE_ID = 'HexPathMgrFactory';

var HexPathMgrFactory = {
  getInstance: function() {
    var fileMgr = null;
    if (checker.isMobile()) {
      fileMgr = require('./hex.mobile.path.mgr');
    } else if (checker.isWeb()) {
      fileMgr = require('./hex.web.path.mgr');
    } else {
      fileMgr = require('./hex.local.path.mgr');
    }
    return fileMgr;
  }
};

module.exports = HexPathMgrFactory;
