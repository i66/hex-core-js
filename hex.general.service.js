const HexGeneralMgr = require('./hex.general.mgr');

class HexGeneralService extends HexGeneralMgr {

  constructor(type) {
    super(type);
    this._isService = true;
  }
}

module.exports = HexGeneralService;
