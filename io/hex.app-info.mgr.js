var checker = require('../../core/tools/hex.checker');
var HexFileMgr = require('./hex.file.mgr.factory').getInstance();
var HexMobileMgr = require('./hex.mobile.mgr');

var info = {};
const PACKAGE_INFO_FILE = 'package.json';

// Load info
if (checker.isWeb()) {
  info = HexFileMgr.readFileJsonSync(PACKAGE_INFO_FILE);
} else {
  info = global.require('./' + PACKAGE_INFO_FILE);
}

var HexAppInfoMgr = {
  getInfo: function() {
    if (checker.isMobile()) {
      return HexMobileMgr.getInfo();
    } else {
      return info;
    }
  }
};

module.exports = HexAppInfoMgr;
