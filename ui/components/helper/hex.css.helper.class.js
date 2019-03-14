var logger = require('../../../tools/hex.logger');
var checker = require('../../../tools/hex.checker');
var util = require('../../../tools/hex.util');

function HexCssHelperClass() {
  this._css = '';
}

HexCssHelperClass.prototype.set = function(css) {
  this._css = css;
  return this;
};

HexCssHelperClass.prototype.add = function(css) {
  this._css += ' ' + css;
  return this;
};

HexCssHelperClass.prototype.addCheck = function(css, isAdd) {
  if (isAdd == true) {
    return this.add(css);
  }
  return this;
};

HexCssHelperClass.prototype.get = function() {
  return this._css;
};

module.exports = HexCssHelperClass;
