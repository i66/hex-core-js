var HexStoreDataMgr = require('../io/hex.store.data.mgr');
var HexFieldMapper = require('../io/hex.field.mapper');
var HexFieldPropMgr = require('../io/hex.field-prop.mgr');
var checker = require('../../core/tools/hex.checker');
var util = require('../../core/tools/hex.util');

var _fieldTypeDef = null;
var _dataStore = null;
var _dispatchFunc = null;

var HexStoreTestHelper = {
  setDispatchFunc: function(dispatchFunc) {
    _dispatchFunc = dispatchFunc;
  },
  setStore: function(dataStore) {
    _dataStore = dataStore;
  },
  setFieldTypeDef: function(fieldTypeDef) {
    _fieldTypeDef = fieldTypeDef;
  },
  checkDefaultMap: function(defaultData) {
    var data = HexStoreDataMgr.getMap(_dataStore.getAll());
    expect(data).toEqual(defaultData);
  },
  checkDefaultVal: function(defaultValue) {
    var data = _dataStore.getAll();
    expect(data).toEqual(defaultValue);
  },

  checkMapIntergrity: function() {
    var all = _dataStore.getAll();
    all.set('test', 123);
    var allNext = _dataStore.getAll();
    expect(allNext === all).toBe(true);
  },

  checkAryIntergrity: function() {
    var all = _dataStore.getAll();
    var allNext = _dataStore.getAll();
    expect(all).toEqual(allNext);

    if (all.length == 0) {
      all[0] = util.getRandomString(10);
      expect(allNext.length).toBe(0);
    } else {
      // Change all vals
      for (var i = 0; i < all.length; all++) {
        all[i] = util.getRandomString(20);
      }
      // totally not equal
      expect(all).not.toEqual(allNext);
      // Each val should not equal
      for (var i = 0; i < all.length; all++) {
        expect(all[i]).not.toEqual(allNext[i]);
      }
    }
  },
  checkListener: function() {
    var mockListener = jest.fn();

    _dataStore.addChangeListener(mockListener);
    _dataStore.emitChange();
    expect(mockListener.mock.calls.length).toBe(1);
    _dataStore.emitChange();
    expect(mockListener.mock.calls.length).toBe(2);

    // Removed, should be no effect
    _dataStore.removeChangeListener(mockListener);
    _dataStore.emitChange();
    expect(mockListener.mock.calls.length).toBe(2);
  },
  checkEventListener: function() {
    var eventId = util.getRandomString(10);
    var mockListener = jest.fn();

    _dataStore.addEventListener(eventId, mockListener);
    _dataStore.emitEvent(eventId);
    expect(mockListener.mock.calls.length).toBe(1);
    _dataStore.emitEvent(eventId);
    expect(mockListener.mock.calls.length).toBe(2);

    // Removed, should be no effect
    _dataStore.removeEventListener(eventId, mockListener);
    _dataStore.emitEvent(eventId);
    expect(mockListener.mock.calls.length).toBe(2);
  },
  checkFieldEqual: function(data, srcData, isMapping) {
    if (isMapping == true) {
      srcData = HexFieldMapper.mapDataKey(srcData, _fieldTypeDef);
    }
    expect(data).toEqual(srcData);
  },

  testDictPut:
  function(putActionAry, finalData, isMapping) {
    for (var i = 0; i < putActionAry.length; i++) {
      _dispatchFunc(putActionAry[i]);
    }
    var data = HexStoreDataMgr.getAry(_dataStore.getAll());
    expect(data.length).toEqual(finalData.length);

    for (var i = 0; i < finalData.length; i++) {
      this.checkFieldEqual(
        data[i], finalData[i], isMapping);
    }
  },
  testDictPutReplace: function(
    putActionAry, replaceActionAry, finalData, isMapping) {
    for (var i = 0; i < putActionAry.length; i++) {
      _dispatchFunc(putActionAry[i]);
    }
    var data = HexStoreDataMgr.getAry(_dataStore.getAll());
    expect(data.length).toEqual(putActionAry.length);

    for (var i = 0; i < replaceActionAry.length; i++) {
      _dispatchFunc(replaceActionAry[i]);
    }

    data = HexStoreDataMgr.getAry(_dataStore.getAll());
    expect(data.length).toEqual(finalData.length);

    for (var i = 0; i < finalData.length; i++) {
      this.checkFieldEqual(
        data[i], finalData[i], true);
    }
  },
  testMapSinglePost:
  function(postActionAry, fieldKey, finalValueAry) {
    var data;
    for (var i = 0; i < postActionAry.length; i++) {
      _dispatchFunc(postActionAry[i]);
      data = HexStoreDataMgr.getMap(_dataStore.getAll());
      expect(data[fieldKey]).toEqual(finalValueAry[i]);
    }
  },
  testMapPost:
  function(postActionAry, finalDataAry, getFuncName) {
    var getFunc = null;
    var isUseGetFunc = false;
    if (checker.isFunction(_dataStore[getFuncName])) {
      getFunc = _dataStore[getFuncName].bind(_dataStore);
      isUseGetFunc = true;
    }
    var data;
    for (var i = 0; i < postActionAry.length; i++) {
      _dispatchFunc(postActionAry[i]);
      if (isUseGetFunc == true) {
        data = getFunc();
      } else {
        data = HexStoreDataMgr.getMap(_dataStore.getAll());
      }

      expect(data).toEqual(finalDataAry[i]);
    }
  },
};
module.exports = HexStoreTestHelper;
