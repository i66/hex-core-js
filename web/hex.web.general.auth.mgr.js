const HexWebBaseAuthMgr = require('./hex.web.base.auth.mgr');

const checker = require('../tools/hex.checker');
const validator = require('../tools/hex.validator');

class HexWebGeneralAuthMgr extends HexWebBaseAuthMgr {
  constructor() {
    super();
  }

  /**
   * @override
   */
  _authUser(userId, password) {
    this._needImplementWarn();
    return this._newResolvedPromise(true);
  }

  /**
   * @override
   */
  _authGetRequest(param) {
    this._needImplementWarn();
    return this._newResolvedPromise(true);
  }

  /**
   * @override
   */
  _authPostRequest(param) {
    this._needImplementWarn();
    return this._newResolvedPromise(true);
  }

}

module.exports = HexWebGeneralAuthMgr;
