var assert = require('assert');
var expect = require('chai').expect;
var should = require('chai').should();

const util = require('../../tools/hex.util');

var HexAesHelper = require('../../crypt/hex.aes.helper');

describe('HexAesHelper', function() {

  it('generateKey - String', function() {
    var password = 'Test_Password1';
    var key = HexAesHelper.generateKey(password);
    key.should.be.a('string');
  });

  it('generateKey - length', function() {
    var password = 'Test_Password2';
    var key = HexAesHelper.generateKey(password);
    key.should.have.lengthOf(32);
  });

  it('generateKey - Not Same Result', function() {
    var password = 'Test_Password';
    var prevKey = null;
    for (var i = 0; i < 5; i++) {
      var key = HexAesHelper.generateKey(password);
      key.should.not.equal(prevKey);
      prevKey = key;
    }
  });

  it('generateIv - string', function() {
    var iv = HexAesHelper.generateIv();
    iv.should.be.a('string');
  });

  it('generateIv - length', function() {
    var iv = HexAesHelper.generateIv();
    iv.should.have.lengthOf(32);
  });

  it('generateIv - Not Same Result', function() {
    var prevIv = null;
    for (var i = 0; i < 5; i++) {
      var iv = HexAesHelper.generateIv();
      iv.should.not.equal(prevIv);
      prevIv = iv;
    }
  });

  it('makeSecureKey', function() {
    var key = HexAesHelper.generateKey('password');
    var iv = HexAesHelper.generateIv();
    var secureKey = HexAesHelper.makeSecureKey(key, iv);
    var targetKey = util.reverseStr(key + iv);
    secureKey.should.be.equal(targetKey);
  });

  it('splitSecureKey', function() {
    var key = HexAesHelper.generateKey('password');
    var iv = HexAesHelper.generateIv();
    var secureKey = HexAesHelper.makeSecureKey(key, iv);

    var data = HexAesHelper.splitSecureKey(secureKey);
    data.key.should.be.equal(key);
    data.iv.should.be.equal(iv);
  });

  it('encrypt and decrypt', function() {
    var content = 'Test Content';
    var iv = HexAesHelper.generateIv();
    var key = HexAesHelper.generateKey('passwordtest');
    var data = HexAesHelper.encrypt(content, key, iv);
    data.should.be.an('string');
    data.should.have.lengthOf.above(0);
    var decrypt = HexAesHelper.decrypt(data, key, iv);
    decrypt.should.be.equal(content);
  });

  it('encryptBySecureKey and decryptBySecureKey', function() {
    var content = 'Test Content';
    var iv = HexAesHelper.generateIv();
    var key = HexAesHelper.generateKey('passwordtest');
    var secureKey = HexAesHelper.makeSecureKey(key, iv);

    var data = HexAesHelper.encrypt(content, key, iv);
    var dataNew = HexAesHelper.encryptBySecureKey(content, secureKey);

    data.should.have.lengthOf.above(0);
    data.should.be.equal(dataNew);

    var decrypt = HexAesHelper.decrypt(data, key, iv);
    var decryptNew = HexAesHelper.decryptBySecureKey(data, secureKey);
    decrypt.should.be.equal(content);
    decryptNew.should.be.equal(content);
  });

});
