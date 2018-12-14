const HexGeneralMgr = require('../hex.general.mgr');

class HexWebBaseUserDataMgr extends HexGeneralMgr {

  /**
  * Check if User Exists
  *
  * @param {string} userId
  * @param {string} password
  * @returns {HexPromise} Async Promise
  * - {stat}
  * - {msg} Error message of exists
  * - {data} No Data
  */
  checkUserExist(userid, password) {
    return this._checkUserExist(userid, password);
  }

  /**
  * Check if User Exists
  *
  * @param {string} userId
  * @param {string} password
  * @returns {HexPromise} Async Promise
  */
  getUserInfo(userId) {
    return this._getUserInfo(userId);
  }

  _checkUserExist(userid, password) {
    this._needImplementWarn();
    return this._newResolvedPromise(true);
  }

  _getUserInfo(userId) {
    this._needImplementWarn();
    return this._newResolvedPromise(true);
  }

}

module.exports = HexWebBaseUserDataMgr;
