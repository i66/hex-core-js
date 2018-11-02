var assert = require('assert');
var expect = require('chai').expect;
var should = require('chai').should();

var HexGeneralMgr = require('../../hex.general.mgr');

describe('HexGeneralMgr', function() {

  it('_checkAndCall', function(done) {
    var stat = 10;
    var msg = 'msg';
    var data = {a: 50, b: [1, 2, 3]};
    var mgr = new HexGeneralMgr();
    mgr._checkAndCall(function(pStat, pMsg, pData) {
      pStat.should.be.equal(stat);
      pMsg.should.be.equal(msg);
      pData.should.be.equal(data);
      done();
    }, stat, msg, data);
  });

  it('_checkAndCallDirect', function(done) {
    var stat = 10;
    var msg = 'msg';
    var data = {a: 50, b: [1, 2, 3]};
    var mgr = new HexGeneralMgr();
    mgr._checkAndCallDirect(function(pStat, pMsg, pData) {
      pStat.should.be.equal(stat);
      pMsg.should.be.equal(msg);
      pData.should.be.equal(data);
      done();
    }, stat, msg, data);
  });

});
