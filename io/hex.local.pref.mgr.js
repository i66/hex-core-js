const HexGeneralModule = require('../hex.general.module');
const HexLocalFileMgr = require('./hex.local.file.mgr');
const path = require('path');
const checker = require('../tools/hex.checker');

class HexLocalPrefEngine extends HexGeneralModule {
  constructor(prefPath) {
    super('HexLocalPrefEngine');
    this._prefPath = prefPath;
    this._prefJson = {};
  }

  _defineModule() {
    this._setIsAsync(false);
    this._setIsService(false);
  }

  _init() {

    var absFilePath = path.resolve(this._prefPath);
    this._logInfo('Read Pref from file: {0}', absFilePath);
    this._prefJson = HexLocalFileMgr.readFileJsonSync(absFilePath);
    if (this._prefJson == null) {
      this._logWarn('Pref file not found...');
      this._prefJson = {};
    }
  }

  get(key, defaultVal) {
    var val = this._prefJson[key];
    if (checker.isSetNonNull(val)) {
      return val;
    }
    return defaultVal;
  }
}

var prefEngine = null;
class HexLocalPrefMgr {

  static load(prefPath) {
    prefEngine = new HexLocalPrefEngine(prefPath);
    prefEngine.getReady();
  }

  static get(key, defaultVal) {
    if (prefEngine == null) {
      return defaultVal;
    }

    return prefEngine.get(key, defaultVal);
  }

}

module.exports = HexLocalPrefMgr;
