var HexActionType = require('../types/hex.action.type');
var HexViewStatFieldType =
    require('../../core/types/field/hex.view.stat.field.type');
var HexStoreDataMgr = require('../io/hex.store.data.mgr');
var HexStoreDataHelper = require('./hex.store.data.helper');
var checker = require('../../core/tools/hex.checker');
var HexStore = require('../../core/stores/hex.store');
var HexViewParamHelperClass =
    require('../components/helper/hex.viewparam.helper.class');

const MODULE_ID = 'HexViewStatStore';
const KEY_VIEW_ID = 'view_id';

const ID_ACTION_CHANGE = HexActionType.VIEW_CHANGE;
const ID_ACTION_BACK = HexActionType.VIEW_BACK;

var fieldType = HexViewStatFieldType;

var _viewParamHistory = [];
var _defaultViewId = '';

var HexViewParamHelper = new HexViewParamHelperClass('');

var HexViewStatStore = Object.assign({}, HexStore, {
  setDefaultViewId: function(viewId) {
    _defaultViewId = viewId;
    HexViewParamHelper.setViewId(viewId);
    this._data.set(fieldType.VIEW_PARAM, HexViewParamHelper.getViewParam());
  },

  getViewParam: function() {
    return HexStoreDataMgr.getMapField(this._data, fieldType.VIEW_PARAM);
  },

  getViewHistory: function() {
    return _viewParamHistory.slice(0);
  },

  clearHistory: function() {
    _viewParamHistory = [];
  },

  _initAction: function() {
    this._actionHelper.registerAction(
      ID_ACTION_CHANGE, this._handleActionChange);
    this._actionHelper.registerAction(
      ID_ACTION_BACK, this._handleActionBack);
  },
  _initCustom: function() {
    this.clearHistory();
  },
  _handleResetStore: function() {
    this.clearHistory();
    return null;
  },
  _handleActionChange: function(storeData, method, data) {
    // Check add history
    var viewParamHistory = data.history;
    var viewParam = data.viewParam;

    if (checker.isSetNonNull(viewParamHistory)) {
      if (checker.isArray(viewParamHistory)) {
        _viewParamHistory = _viewParamHistory.concat(viewParamHistory);
      } else {
        _viewParamHistory.push(viewParamHistory);
      }
    } else {
      // Push current
      if (checker.isSetNonNull(viewParam)) {
        _viewParamHistory.push(this.getViewParam());
      }
    }

    return this._handleViewParamUpdate(viewParam, storeData);
  },

  _handleActionBack: function(storeData, method, data) {
    var viewParam = _viewParamHistory.pop();
    return this._handleViewParamUpdate(viewParam, storeData);
  },

  _handleViewParamUpdate: function(viewParam, storeData) {
    if (!checker.isSetNonNull(viewParam)) {
      return HexStoreDataHelper.getRes(null);
    }

    // Reset History
    if (viewParam[KEY_VIEW_ID] == _defaultViewId) {
      this.clearHistory();
    }

    var newData = {};
    newData[fieldType.VIEW_PARAM] = viewParam;
    return HexStoreDataHelper.postMap(newData, storeData, fieldType);
  },
});

HexViewStatStore.init(MODULE_ID, ID_ACTION_CHANGE, fieldType);

module.exports = HexViewStatStore;
