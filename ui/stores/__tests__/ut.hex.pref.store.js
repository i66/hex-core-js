'use strict';

jest.mock('../../dispatcher/hex.dispatcher');
jest.mock('../../tools/hex.logger');
jest.mock('../../io/hex.local.file.mgr');

global.require = require;

describe('HexPrefStore', function() {

  var checker = require('../../tools/hex.checker');
  var logger = require('../../tools/hex.logger');
  var HexActionMethodType =
      require('../../types/hex.action.method.type');
  var HexPrefFieldType =
      require('../../types/field/hex.pref.field.type');
  var HexAppConstant = require('../../types/hex.app.constant');
  var HexStoreTestHelper = require('../hex.store.test.helper');
  var EboxUiDispatcher = require('../../dispatcher/hex.dispatcher');
  var EboxUiPrefStore = require('../hex.pref.store');
  var HexFileMgr = require('../../io/hex.file.mgr.factory').getInstance();
  var HexActionType = require('../../types/hex.action.type');
  var HexLogLevel = require('../../types/hex.log.level');

  var callback;
  var defaultData = {};
  defaultData[HexPrefFieldType.LANG] = HexAppConstant.LANG.DEFAULT_VALUE;
  defaultData[HexPrefFieldType.IS_VOL_ON] = HexAppConstant.IS_VOL_ON;
  defaultData[HexPrefFieldType.LOG_LEVEL] = HexLogLevel.NORMAL;
  defaultData[HexPrefFieldType.IS_FULL_SCREEN] = false;
  defaultData[HexPrefFieldType.IS_NEVER_CLOSE] = false;

  var dataInit = {};
  dataInit[HexPrefFieldType.LANG] = 'EN_US';
  dataInit[HexPrefFieldType.IS_VOL_ON] = true;
  dataInit[HexPrefFieldType.LOG_LEVEL] = HexLogLevel.NORMAL;
  dataInit[HexPrefFieldType.IS_FULL_SCREEN] = false;
  dataInit[HexPrefFieldType.IS_NEVER_CLOSE] = false;

  var dataUpdate1 = {};
  dataUpdate1[HexPrefFieldType.LANG] = 'LANG_1';
  dataUpdate1[HexPrefFieldType.IS_VOL_ON] = false;
  dataUpdate1[HexPrefFieldType.LOG_LEVEL] = HexLogLevel.HIGH;
  dataUpdate1[HexPrefFieldType.IS_FULL_SCREEN] = true;
  dataUpdate1[HexPrefFieldType.IS_NEVER_CLOSE] = false;

  var dataUpdate2 = {};
  dataUpdate2[HexPrefFieldType.LANG] = 'LANG_2';
  dataUpdate2[HexPrefFieldType.IS_VOL_ON] = true;
  dataUpdate2[HexPrefFieldType.LOG_LEVEL] = HexLogLevel.NORMAL;
  dataUpdate2[HexPrefFieldType.IS_FULL_SCREEN] = false;
  dataUpdate2[HexPrefFieldType.IS_NEVER_CLOSE] = false;

  var dataUpdate3 = {};
  dataUpdate3[HexPrefFieldType.LANG] = 'LANG_3';
  dataUpdate3[HexPrefFieldType.IS_VOL_ON] = false;
  dataUpdate3[HexPrefFieldType.LOG_LEVEL] = HexLogLevel.DEBUG;
  dataUpdate3[HexPrefFieldType.IS_FULL_SCREEN] = true;
  dataUpdate3[HexPrefFieldType.IS_NEVER_CLOSE] = true;

  var dataFieldUpdate1 = {};
  dataFieldUpdate1[HexPrefFieldType.LANG] = 'LANG_UPDATE_1';

  var dataFieldRes1 = {};
  dataFieldRes1[HexPrefFieldType.LANG] = 'LANG_UPDATE_1';
  dataFieldRes1[HexPrefFieldType.IS_VOL_ON] = false;
  dataFieldRes1[HexPrefFieldType.LOG_LEVEL] = HexLogLevel.HIGH;
  dataFieldRes1[HexPrefFieldType.IS_FULL_SCREEN] = true;
  dataFieldRes1[HexPrefFieldType.IS_NEVER_CLOSE] = false;

  var dataFieldUpdate2 = {};
  dataFieldUpdate2[HexPrefFieldType.IS_VOL_ON] = true;
  dataFieldUpdate2[HexPrefFieldType.IS_FULL_SCREEN] = false;

  var dataFieldRes2 = {};
  dataFieldRes2[HexPrefFieldType.LANG] = 'LANG_UPDATE_1';
  dataFieldRes2[HexPrefFieldType.IS_VOL_ON] = true;
  dataFieldRes2[HexPrefFieldType.LOG_LEVEL] = HexLogLevel.HIGH;
  dataFieldRes2[HexPrefFieldType.IS_FULL_SCREEN] = false;
  dataFieldRes2[HexPrefFieldType.IS_NEVER_CLOSE] = false;

  // mock actions
  var actionInit = {
    actionType: HexActionType.APP_INIT,
  };

  var actionUpdate1 = {
    actionType: HexActionType.PREF_CHANGE,
    method: HexActionMethodType.POST,
    data: dataUpdate1,
  };

  var actionUpdate2 = {
    actionType: HexActionType.PREF_CHANGE,
    method: HexActionMethodType.POST,
    data: dataUpdate2,
  };

  var actionUpdate3 = {
    actionType: HexActionType.PREF_CHANGE,
    method: HexActionMethodType.POST,
    data: dataUpdate3,
  };

  var actionFieldUpdate1 = {
    actionType: HexActionType.PREF_CHANGE,
    method: HexActionMethodType.POST,
    data: dataFieldUpdate1,
  };

  var actionFieldUpdate2 = {
    actionType: HexActionType.PREF_CHANGE,
    method: HexActionMethodType.POST,
    data: dataFieldUpdate2,
  };

  var actionResetStore = {
    actionType: HexActionType.RESET_STORE
  };

  beforeEach(function() {
    EboxUiPrefStore.reset();
    callback = EboxUiDispatcher.register.mock.calls[0][0];

    HexStoreTestHelper.setStore(EboxUiPrefStore);
    HexStoreTestHelper.setDispatchFunc(callback);
    HexStoreTestHelper.setFieldTypeDef(HexPrefFieldType);
  });

  it('should have id', function() {
    expect(EboxUiPrefStore.getId().length > 0).toBe(true);
  });

  it('registers a callback with the dispatcher', function() {
    expect(EboxUiDispatcher.register.mock.calls.length).toBe(1);
  });

  it('should initialize with default data', function() {
    HexStoreTestHelper.checkDefaultMap(defaultData);
  });

  it('edit return data should not affect original', function() {
    HexStoreTestHelper.checkMapIntergrity();
  });

  it('addChangeListener / removeChangeListener / emitChange', function() {
    HexStoreTestHelper.checkListener();
  });

  it('init - success', function() {
    HexFileMgr.readFileJsonSync = function() {
      return dataInit;
    };

    HexFileMgr.writeFileJson = function() {
    };

    HexStoreTestHelper.checkDefaultMap(defaultData);

    HexStoreTestHelper.testMapPost(
      [actionInit], [dataInit]);

  });

  it('Pref Change - success', function() {
    HexStoreTestHelper.testMapPost(
      [actionUpdate1, actionUpdate2, actionUpdate3],
      [dataUpdate1, dataUpdate2, dataUpdate3]
    );
  });

  it('Pref Field Change - success', function() {
    HexStoreTestHelper.testMapPost(
      [actionUpdate1], [dataUpdate1]
    );

    HexStoreTestHelper.testMapPost(
      [actionFieldUpdate1, actionFieldUpdate2],
      [dataFieldRes1, dataFieldRes2]
    );
  });

  it('Reset Store', function() {
    callback(actionResetStore);
    var data  = EboxUiPrefStore.getAll();
    expect(data.toJS()).toEqual(defaultData);
  });

});
