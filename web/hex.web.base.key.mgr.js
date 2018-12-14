
const HexGeneralMgr = require('../hex.general.mgr');
const HexWebKeyStatus = require('./types/hex.web.key.status');

class HexWebBaseKeyMgr extends HexGeneralMgr {

  /**
  * Get new API key by given user id
  *
  * @param {string} userId
  * @param {function} cb(stat, msg, data) - Callback
  * - {HexWebKeyStatus} stat
  * - {string} msg
  * - {object} data - Generated API key
  *   - {string} apiKey
  *   - {string} secureKey
  */
  createApiKeys(userId) {
    var promise = this._newPromise();
    var _this = this;
    this.generateApiKey(userId).success(function(res) {
      var apiKey = res.data;
      _this.generateSecureKey(apiKey).success(function(res) {
        var secureKey = res.data;
        promise.resolve(true, HexWebKeyStatus.GET_SUCCESS, res.msg,
          {
            apiKey: apiKey,
            secureKey: secureKey
          }
        );
      }).error(function(res) {
        promise.resolve(false, HexWebKeyStatus.GET_FAILED, res.msg, res.data);
      });
    }).error(function(res) {
      promise.resolve(false, HexWebKeyStatus.GET_FAILED, res.msg, res.data);
    });
    return promise;
  }

  getApiKey(userId) {

  }

  checkApiKey(apiKey) {

  }

  getSecureKey(apiKey) {
    // Get userId by API Key
    // Get SecureKey by userId
  }

  updateApiKeyTime(apiKey, ts) {

  }

  /**
  * Generate API key
  *
  * @param {string} input - Reference
  * @param {function} cb(stat, msg, data) - Callback
  * - {HexWebKeyStatus} stat
  * - {string} msg
  * - {string} data - Generated API key
  */
  generateApiKey(input) {
    this._needImplementWarn();
    return this._newResolvedPromise(
      true, HexWebKeyStatus.GEN_SUCCESS, '', 'api-key');
  }

  /**
  * Generate Secure key
  *
  * @param {string} password - Password for key generation
  * @param {function} cb(stat, msg, data) - Callback
  * - {HexWebKeyStatus} stat
  * - {string} msg
  * - {string} data - Generated Secure key
  */
  generateSecureKey(password) {
    this._needImplementWarn();
    return this._newResolvedPromise(
      true, HexWebKeyStatus.GEN_SUCCESS, '', 'secure-key');
  }

}

module.exports = HexWebBaseKeyMgr;
