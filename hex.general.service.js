const HexGeneralMgr = require('./hex.general.mgr');

class HexGeneralService extends HexGeneralMgr {

  constructor() {
    super();
    this._isService = true;
  }
}

module.exports = HexGeneralService;
