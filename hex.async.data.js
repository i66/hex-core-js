const HexGeneralData = require('./hex.general.data');

const checker = require('./tools/hex.checker');

class HexAsyncData extends HexGeneralData {
  constructor(stat, msg, data, isOk) {
    super();
    this._stat = stat;
    this._msg = msg;
    this._data = data;
    this._isOk = isOk === true;
  }

  get stat() {
    return this._stat;
  }

  get msg() {
    return this._msg;
  }

  get data() {
    return this._data;
  }

  get isOk() {
    return this._isOk;
  }

  setIsOk(isOk) {
    this._isOk = isOk;
  }

  _clone() {
    return new HexAsyncData(this._stat, this._msg, this._data, this._isOk);
  }

}

module.exports = HexAsyncData;
