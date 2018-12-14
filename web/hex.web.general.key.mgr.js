const uuidv4 = require('uuid/v4');
const HexAesHelper = require('../crypt/hex.aes.helper');
const HexWebBaseKeyMgr = require('./hex.web.base.key.mgr');
const HexWebKeyStatus = require('./types/hex.web.key.status');
const checker = require('../tools/hex.checker');
class HexWebGeneralKeyMgr extends HexWebBaseKeyMgr {

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
    var promise = this._newPromise();

    this._generateUniqueApiKey().success(function(res) {
      promise.resolve(true, HexWebKeyStatus.GEN_SUCCESS, res.msg, res.data);
    }).error(function(res) {
      promise.resolve(false, HexWebKeyStatus.GEN_FAILED, res.msg, res.data);
    });
    return promise;
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
    var key = HexAesHelper.generateKey(this._generateNewKey());
    var iv = HexAesHelper.generateIv();
    var secureKey = HexAesHelper.makeSecureKey(key, iv);
    return this._newResolvedPromise(
      true, HexWebKeyStatus.GEN_SUCCESS, '', secureKey);
  }

  _generateUniqueApiKey(promise) {
    if (!checker.isSetNonNull(promise)) {
      promise = this._newPromise();
    }

    var _this = this;
    var apiKey = this._generateNewKey();
    //promise.resolve(true, HexWebKeyStatus.GEN_SUCCESS, '', apiKey);

    this._isApiKeyUnique(apiKey).success(function(res) {
      promise.resolve(true, HexWebKeyStatus.GEN_SUCCESS, res.msg, apiKey);
    }).error(function(res) {
      // Prevent from stack overflow
      setTimeout(function() {
        _this._generateUniqueApiKey(promise);
      }, 0);
    });

    return promise;
  }

  /**
  * Check if API key is unique
  *
  * @param {string} apiKey - Generated API key
  * @param {function} cb(stat, msg, data) - Callback
  * - {HexWebKeyStatus} stat
  * - {string} msg
  * - {string} data - Generated Secure key
  */
  _isApiKeyUnique(apiKey) {
    this._needImplementWarn();
    return this._newResolvedPromise(HexWebKeyStatus.KEY_UNIQUE, '', apiKey);
  }

  _generateNewKey() {
    return uuidv4().replace(/-/g, '');
  }

}

module.exports = HexWebGeneralKeyMgr;
