const uuidv4 = require('uuid/v4');
const crypto = require('crypto');

const util = require('../tools/hex.util');

const algorithm = 'aes-256-ctr';

class HexAesHelper {
  static generateKey(password) {
    var salt = crypto.randomBytes(16);
    return crypto.pbkdf2Sync(
          password, salt, 100000, 16, 'sha512').toString('hex');
  }

  static generateIv() {
    var iv = crypto.randomBytes(16);
    return iv.toString('hex');
  }

  static encrypt(text, key, ivStr) {
    var iv = Buffer.from(ivStr, 'hex');
    var cipher = crypto.createCipheriv(algorithm, key, iv);
    var crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
  }

  static decrypt(text, key, ivStr) {
    var iv = Buffer.from(ivStr, 'hex');
    var decipher = crypto.createDecipheriv(algorithm, key, iv);
    var dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
  }

  static encryptBySecureKey(text, secureKey) {
    var keyInfo = HexAesHelper.splitSecureKey(secureKey);
    return HexAesHelper.encrypt(text, keyInfo.key, keyInfo.iv);
  }

  static decryptBySecureKey(text, secureKey) {
    var keyInfo = HexAesHelper.splitSecureKey(secureKey);
    return HexAesHelper.decrypt(text, keyInfo.key, keyInfo.iv);
  }

  static makeSecureKey(key, iv) {
    return util.reverseStr(key + iv);
  }

  static splitSecureKey(secureKey) {
    var revKey = util.reverseStr(secureKey);
    var key = revKey.substr(0, 32);
    var iv = revKey.substr(32, 32);
    return {key: key, iv: iv};
  }

};

module.exports = HexAesHelper;
