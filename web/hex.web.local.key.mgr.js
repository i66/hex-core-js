const uuidv4 = require('uuid/v4');
const HexAesHelper = require('../crypt/hex.aes.helper');
const HexWebGeneralKeyMgr = require('./hex.web.general.key.mgr');
const HexWebKeyStatus = require('./types/hex.web.key.status');

const checker = require('../tools/hex.checker');

class HexWebLocalKeyMgr extends HexWebGeneralKeyMgr {
  constructor() {
    super();
    this.apiKeyMap = {};
    this.reverseApiKeyMap = {};
  }

  _defineModule() {
    this._setIsAsync(true);
    this._setIsService(false);
  }

  _isApiKeyUnique(apiKey) {
    var promise = this._newPromise();
    var userId = this.reverseApiKeyMap[apiKey];
    var stat = HexWebKeyStatus.KEY_UNIQUE;
    var isOk = true;
    if (checker.isSetNonNull(userId)) {
      stat = HexWebKeyStatus.KEY_DUPLICATE;
      isOk = false;
    }
    promise.resolve(isOk, stat, '', userId);
    return promise;

  }

}

module.exports = HexWebLocalKeyMgr;
