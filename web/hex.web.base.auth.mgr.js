const HexGeneralMgr = require('../hex.general.mgr');

const checker = require('../tools/hex.checker');
const validator = require('../tools/hex.validator');

class HexWebBaseAuthMgr extends HexGeneralMgr {
  constructor() {
    super();
  }

  /**
  * @override
  */
  _defineModule() {
    super._defineModule();
    this._setIsAsync(true);
    this._setIsService(false);
  }

  /**
  * Authentiate user creditementals
  *
  * @param {string} userId
  * @param {string} password
  * @returns {HexPromise} Async Promise
  */
  authUser(userId, password) {
    return this._authUser(userId, password);
  }

  /**
  * Validate request Time Stamp
  *
  * @param {string} ts - The timestamp string
  * @returns {boolean} Is timestamp is valid
  */
  validateTs(ts) {
    return this._validateTs(ts);
  }


  /**
  * Validate Get request parameter
  *
  * @param {string} param
  * @returns {HexPromise} Async Promise
  */
  authGetRequest(param) {
    return this._authGetRequest(param);
  }

  /**
  * Validate Post request parameter
  *
  * @param {string} param
  * @returns {HexPromise} Async Promise
  */
  authPostRequest(param) {
    return this._authPostRequest(param);
  }

  _authUser(userId, password) {
    this._needImplementWarn();
    return this._newResolvedPromise(true);
  }

  _authGetRequest(param) {
    this._needImplementWarn();
    return this._newResolvedPromise(true);
  }

  _authPostRequest(param) {
    this._needImplementWarn();
    return this._newResolvedPromise(true);
  }

  _validateTs(ts) {
    this._needImplementWarn();
    return true;
  }

}

module.exports = HexWebBaseAuthMgr;
