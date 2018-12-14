const HexWebGeneralUserDataMgr = require('./hex.web.general.user.data.mgr');
const HexWebUserDataStatus = require('./types/hex.web.user.data.status');

class HexWebStaticUserDataMgr extends HexWebGeneralUserDataMgr {

  /**
   * @override
   */
  _checkUserExist(userid, password) {
    var isValid =
      userid == 'HEX' && password == '8aa081b78d101322f61234a905254301';
    var promise = this._newPromise();
    if (isValid === true) {
      promise.resolve(true, HexWebUserDataStatus.USER_EXISTS);
    } else {
      promise.resolve(false, HexWebUserDataStatus.USER_NOT_EXISTS);
    }
    return promise;
  }

  /**
   * @override
   */
  _getUserInfo(userId) {
    if (userId == 'HEX') {
      return this._newResolvedPromise(
        true, HexWebUserDataStatus.GET_USER_SUCESS,
        {
          'user_id': 'HEX',
          'display_name': 'HEX User'
        });
    } else {
      return this._newResolvedPromise(
        false, HexWebUserDataStatus.GET_USER_FAILED);
    }
  }
}

module.exports = HexWebStaticUserDataMgr;
