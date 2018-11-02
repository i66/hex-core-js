const HexAsyncData = require('./hex.async.data');

const checker = require('./tools/hex.checker');

class HexPromise {
  constructor(id, parent) {
    this._successCb = null;
    this._failCb = null;
    this._finalCb = null;
    this._parent = parent;
    this._id = id;
    this._isResolved = false;

    this._data = null;
    this._delayResolveId = -1;
  }

  success(cb) {
    this._successCb = cb;
    this._checkDelayResolve();
    return this;
  }

  error(cb) {
    this._failCb = cb;
    this._checkDelayResolve();
    return this;
  }

  finally(cb) {
    this._finalCb = cb;
    this._checkDelayResolve();
    return this;
  }

  resolve(isOk, stat, msg, data) {
    var res = new HexAsyncData(stat, msg, data, isOk);
    this._resolve(res);
  }

  _resolve(res) {
    var callRes = false;
    var cb = res.isOk ? this._successCb : this._failCb;

    callRes |= this._checkAndCall(cb, res);
    callRes |= this._checkAndCall(this._finalCb, res);

    this._isResolved = true;
    if (callRes == true) {
      this._dispose();
    } else {
      this._saveResolvedData(res);
    }
  }

  _checkDelayResolve() {
    if (this._isResolved == false) {
      return;
    }
    if (this._delayResolveId != -1) {
      clearTimeout(this._delayResolveId);
    }
    var _this = this;
    setTimeout(function() {
      _this._resolve(_this._data);
    }, 0);
  }

  _saveResolvedData(res) {
    this._data = res.clone();
    //this._data.setIsOk(isOk);
  }

  _dispose() {
    this._successCb = null;
    this._failCb = null;
    this._finalCb = null;
    this._parent = null;
  }

  _checkAndCall(cb, stat, msg, data) {
    if (checker.isFunction(cb)) {
      // Prevent from stack overflow
      setTimeout(function() {
        cb(stat, msg, data);
      }, 0);
      return true;
    }
    return false;
  }

  _checkAndCallDirect(cb, stat, msg, data) {
    if (checker.isFunction(cb)) {
      cb(stat, msg, data);
    }
  }
}

module.exports = HexPromise;
