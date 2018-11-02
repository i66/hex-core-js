const HexPromise = require('./hex.promise');

const checker = require('./tools/hex.checker');

class HexPromiseMgr {
  constructor(parent) {
    this._idx = 0;
    this._promiseList = {};
    this._parent = parent;
  }

  _getNextId() {
    this._idx++;
    if (this._idx > 65535) {
      this._idx = 1;
    }
    return '#' + this._idx;
  }

  getPromise(id) {
    var promise = this._promiseList[id];
    if (checker.isSetNonNull(promise)) {
      return promise;
    }
    return null;
  }

  newPromise() {
    var id = this._getNextId();
    var promise = new HexPromise(id, this._parent);
    this._promiseList[id] = promise;
    return promise;
  }
}

module.exports = HexPromiseMgr;
