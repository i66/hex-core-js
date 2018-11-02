var assert = require('assert');
var expect = require('chai').expect;
var should = require('chai').should();

var HexPromiseMgr = require('../../hex.promise.mgr');
var HexAsyncData = require('../../hex.async.data');

describe('HexPromiseMgr', function() {
  const STAT_SUCCESS = 1;
  const MSG_SUCCESS = 'OK';
  const DATA_SUCCESS = {ok: 1};

  const STAT_FAIL = -1;
  const MSG_FAIL = 'FAIL';
  const DATA_FAIL = {ok: 0};

  class TestModule {
    constructor() {
      this._promiseMgr = new HexPromiseMgr(this);
    }
    asyncFunc(isSuccess) {
      var promise = this._promiseMgr.newPromise();
      setTimeout(function() {
        if (isSuccess) {
          promise.resolve(true, STAT_SUCCESS, MSG_SUCCESS, DATA_SUCCESS);
        } else {
          promise.resolve(false, STAT_FAIL, MSG_FAIL, DATA_FAIL);
        }

      }, 0);

      return promise;
    }

    delayAsyncFunc(isSuccess) {
      var promise = this._promiseMgr.newPromise();
      if (isSuccess) {
        promise.resolve(true, STAT_SUCCESS, MSG_SUCCESS, DATA_SUCCESS);
      } else {
        promise.resolve(false, STAT_FAIL, MSG_FAIL, DATA_FAIL);
      }

      return promise;
    }

  }

  it('Promise Chain Success', function(done) {
    var module = new TestModule();
    var isSuccessCalled = 0;
    var isFailCalled = 0;
    module.asyncFunc(true).success(function(res) {
      res.stat.should.be.equal(STAT_SUCCESS);
      res.msg.should.be.equal(MSG_SUCCESS);
      res.data.should.be.equal(DATA_SUCCESS);
      isSuccessCalled++;
    }).error(function(res) {
      isFailCalled++;
    }).finally(function(res) {
      res.stat.should.be.equal(STAT_SUCCESS);
      res.msg.should.be.equal(MSG_SUCCESS);
      res.data.should.be.equal(DATA_SUCCESS);

      isSuccessCalled.should.be.equal(1);
      isFailCalled.should.be.equal(0);
      done();
    });
  });

  it('Promise Chain Failed', function(done) {
    var module = new TestModule();
    var isSuccessCalled = 0;
    var isFailCalled = 0;
    module.asyncFunc(false).success(function(stat, msg, data) {
      isSuccessCalled++;
    }).error(function(res) {
      res.stat.should.be.equal(STAT_FAIL);
      res.msg.should.be.equal(MSG_FAIL);
      res.data.should.be.equal(DATA_FAIL);
      isFailCalled++;
    }).finally(function(res) {
      res.stat.should.be.equal(STAT_FAIL);
      res.msg.should.be.equal(MSG_FAIL);
      res.data.should.be.equal(DATA_FAIL);

      isSuccessCalled.should.be.equal(0);
      isFailCalled.should.be.equal(1);
      done();
    });
  });

  it('Delay Promise Chain Success', function(done) {
    var module = new TestModule();
    var isSuccessCalled = 0;
    var isFailCalled = 0;
    module.delayAsyncFunc(true).success(function(res) {
      res.stat.should.be.equal(STAT_SUCCESS);
      res.msg.should.be.equal(MSG_SUCCESS);
      res.data.should.be.equal(DATA_SUCCESS);
      isSuccessCalled++;
    }).error(function(res) {
      isFailCalled++;
    }).finally(function(res) {
      res.stat.should.be.equal(STAT_SUCCESS);
      res.msg.should.be.equal(MSG_SUCCESS);
      res.data.should.be.equal(DATA_SUCCESS);

      isSuccessCalled.should.be.equal(1);
      isFailCalled.should.be.equal(0);
      done();
    });
  });

  it('Delay Promise Chain Failed', function(done) {
    var module = new TestModule();
    var isSuccessCalled = 0;
    var isFailCalled = 0;
    module.delayAsyncFunc(false).success(function(res) {
      isSuccessCalled++;
    }).error(function(res) {
      res.stat.should.be.equal(STAT_FAIL);
      res.msg.should.be.equal(MSG_FAIL);
      res.data.should.be.equal(DATA_FAIL);
      isFailCalled++;
    }).finally(function(res) {
      res.stat.should.be.equal(STAT_FAIL);
      res.msg.should.be.equal(MSG_FAIL);
      res.data.should.be.equal(DATA_FAIL);

      isSuccessCalled.should.be.equal(0);
      isFailCalled.should.be.equal(1);
      done();
    });
  });

});
