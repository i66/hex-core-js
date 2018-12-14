const uuidv4 = require('uuid/v4');
const crypto = require('crypto');
const HexWebGeneralAuthMgr = require('./hex.web.general.auth.mgr');
const HexWebAuthStatus = require('./types/hex.web.auth.status');
const HexWebUserDataStatus = require('./types/hex.web.user.data.status');
const HexWebBaseUserDataMgr = require('./hex.web.base.user.data.mgr');
const HexWebBaseKeyMgr = require('./hex.web.base.key.mgr');
const HexAesHelper = require('../crypt/hex.aes.helper');

const checker = require('../tools/hex.checker');
const validator = require('../tools/hex.validator');

const MOD_USER_DATA_MGR = 'userDataMgr';
const MOD_KEY_MGR = 'keyMgr';
const VALID_DIFF_MS = 5000 * 10;

class HexWebAuthMgr extends HexWebGeneralAuthMgr {
  constructor(height, width) {
    super();
  }

  _defineModule() {
    super._defineModule();
    this._setIsAsync(true);

    this._regExtModule(MOD_USER_DATA_MGR, HexWebBaseUserDataMgr);
    this._regExtModule(MOD_KEY_MGR, HexWebBaseKeyMgr);
  }

  _postInit(config) {
    this._userDataMgr = this._getExtModule(MOD_USER_DATA_MGR);
    this._keyMgr = this._getExtModule(MOD_KEY_MGR);
  }

  /**
   * @override
   */
  _authUser(userId, password) {
    var promise = this._newPromise();
    var _this = this;
    this._userDataMgr.checkUserExist(userId, password).success(function(res) {
      // Get API key
      _this._keyMgr.createApiKeys(userId).success(function(res) {
        promise.resolve(true, HexWebAuthStatus.AUTH_PASS, res.msg, res.data);
      }).error(function(res) {
        promise.resolve(false, HexWebAuthStatus.REG_FAILED, res.msg, res.data);
      });
    }).error(function(res) {
      promise.resolve(false, HexWebAuthStatus.AUTH_FAILED, res.msg, res.data);
    });

    return promise;
  }

  /**
  * Validate Get request parameter
  *
  * @param {string} apiKey
  * @param {string} sign
  * @param {string} ts
  * @param {string} param
  * @returns {boolean} If request is valid
  */
  authGetRequest(apiKey, sign, ts, param, cb) {
    var paramWithoutSign = null;
    var paramDataMap = {};

    var tokens = param.split('&');
    var res = [];

    for (var i = 0; i < tokens.length; i++) {
      var signToken = tokens[i].split('=');
      if (signToken[0].length > 4 || signToken[0].substr(0, 4) == 'sign') {
        sign = signToken[1];
      } else {
        res.push(tokens[i]);
      }
      paramDataMap[signToken[0]] = signToken[1];
    }
    paramWithoutSign = res.join('&');

    this._authRequest(paramDataMap, paramWithoutSign, cb);
  }

  authPostRequest(param) {

    var paramWithoutSign = null;
    var paramDataMap = {};

    var data = validator.ensureJsonParsed(param);
    if (checker.isStr(data.sign)) {
      delete data.sign;
      paramWithoutSign = JSON.strinify(data);
      paramDataMap = data;
    }

    return this._authRequest(paramDataMap, paramWithoutSign, cb);
  }

  _authRequest(paramDataMap, paramWithoutSign) {
    var apiKey = paramDataMap.apiKey;
    var sign = paramDataMap.sign;
    var ts = paramDataMap.ts;

    var promise = this._newPromise();

    if (!checker.isSetNonNullMulti(apiKey, sign, ts, paramWithoutSign)) {
      promise.resolve(false, HexWebAuthStatus.AUTH_FAILED, 'Invalid Param');
      return promise;
    }

    // 1. Validate ts
    if (this._validateTs(ts) != true) {
      promise.resolve(false, HexWebAuthStatus.AUTH_FAILED, 'Request Timeout');
      return promise;
    }

    // 2. Validate API Key
    if (this.keyMgr.checkApiKey(apiKey) == true) {
      promise.resolve(false, HexWebAuthStatus.AUTH_FAILED, 'Invalid API Key');
      return promise;
    }

    // 3. Get SecureKey by API Key
    var secureKey = this.keyMgr.getSecureKey(apiKey);
    if (!checker.isSetNonNull(secureKey)) {
      promise.resolve(false, HexWebAuthStatus.AUTH_FAILED, 'No Secure Key');
      return promise;
    }

    // 4. Validate sign
    var encryptedParam =
        HexAesHelper.encryptBySecureKey(paramWithoutSign, secureKey);

    if (this._validateSign(sign, encryptedParam)) {
      promise.resolve(true, HexWebAuthStatus.AUTH_PASS, '', paramDataMap);
      // 5. Update API key timestamp
    } else {
      promise.resolve(false, HexWebAuthStatus.AUTH_FAILED, 'Sign Not Match');
    }
    return promise;
  }

  _validateSign(sign, encryptedParam) {
    return sign == encryptedParam.substr(0, 64);
  }

  _validateTs(ts) {
    var ts = validator.ensureInt(ts);
    var nowTs = Date.now();

    var diff = nowTs - ts;
    //this._logSelfDebug('Time Diff: {0}, {1} - {2}', nowTs, ts, diff);
    if (diff < VALID_DIFF_MS) {
      return true;
    }
    return false;
  }

}

module.exports = HexWebAuthMgr;
