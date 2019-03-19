var checker = require('../../../tools/hex.checker');
var util = require('../../../tools/hex.util');

const KEY_VIEW_ID = 'view_id';

function HexViewParamHelperClass(id) {
  this._viewParam = {};
  this._viewParam[KEY_VIEW_ID] = '';
  this._createParm = {};
  this._targetId = id;
}

HexViewParamHelperClass.prototype.setViewParam = function(viewParam) {
  if (checker.isSetNonNull(viewParam)) {
    this._viewParam = viewParam;
  }
};

HexViewParamHelperClass.prototype.setViewId = function(viewId) {
  this._viewParam[KEY_VIEW_ID] = viewId;
};

HexViewParamHelperClass.prototype.getViewParam = function() {
  return Object.assign({}, this._viewParam);
};

HexViewParamHelperClass.prototype.getViewId = function() {
  return util.getProp(this._viewParam, KEY_VIEW_ID, null);
};

HexViewParamHelperClass.prototype.setValue = function(key, value) {
  this._viewParam[key] = value;
};

HexViewParamHelperClass.prototype.getValue = function(key, defaulValue) {
  return util.getProp(this._viewParam, key, defaulValue);
};

HexViewParamHelperClass.prototype.initNewParam = function(viewId) {
  this._createParm = {};
  this._createParm[KEY_VIEW_ID] = viewId;
};

HexViewParamHelperClass.prototype.setNewValue = function(key, value) {
  this._createParm[key] = value;
};

HexViewParamHelperClass.prototype.getNewParam = function() {
  return Object.assign({}, this._createParm);
};

module.exports = HexViewParamHelperClass;
