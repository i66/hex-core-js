'use strict';

jest.mock('../../dispatcher/hex.dispatcher');
//jest.mock('../../hex/tools/hex.logger');

global.require = require;

describe('HexViewStatStore', function() {

  var checker = require('../../tools/hex.checker');
  var logger = require('../../tools/hex.logger');
  var HexActionType = require('../../types/hex.action.type');
  var HexActionMethodType =
      require('../../types/hex.action.method.type');
  var HexViewStatFieldType =
      require('../../types/field/hex.view.stat.field.type');
  //var EboxUiConstant = require('../../types/eboxui.constant');
  var HexStoreTestHelper = require('../hex.store.test.helper');
  var HexViewParamHelperClass =
      require('../../components/helper/hex.viewparam.helper.class');
  var HexDispatcher = require('../../dispatcher/hex.dispatcher');
  var HexViewStatStore = require('../hex.view.stat.store');
  var HexActionType = require('../../types/hex.action.type');
  var callback;

  var DEFAULT_VIEW = '';

  var HexViewParamHelper = new HexViewParamHelperClass('UNIT');

  const KEY_PARAM_A = 'param_a';
  const KEY_PARAM_B = 'param_b';
  const KEY_PARAM_C = 'param_c';

  var viewId1 = 'viewId1';
  var viewId2 = 'viewId2';
  var viewId3 = 'viewId3';

  var paramValueA1 = 'paramValueA1';
  var paramValueB1 = 'paramValueB1';
  var paramValueC1 = 'paramValueC1';

  var paramValueA2 = 'paramValueA2';
  var paramValueB2 = 'paramValueB2';
  var paramValueC2 = 'paramValueC2';

  var paramValueA3 = 'paramValueA3';
  var paramValueB3 = 'paramValueB3';
  var paramValueC3 = 'paramValueC3';

  HexViewParamHelper.initNewParam(viewId1);
  HexViewParamHelper.setNewValue(KEY_PARAM_A, paramValueA1);
  HexViewParamHelper.setNewValue(KEY_PARAM_B, paramValueB1);
  HexViewParamHelper.setNewValue(KEY_PARAM_C, paramValueC1);
  var data1 = HexViewParamHelper.getNewParam();

  HexViewParamHelper.initNewParam(viewId2);
  HexViewParamHelper.setNewValue(KEY_PARAM_A, paramValueA2);
  HexViewParamHelper.setNewValue(KEY_PARAM_B, paramValueB2);
  HexViewParamHelper.setNewValue(KEY_PARAM_C, paramValueC2);
  var data2 = HexViewParamHelper.getNewParam();

  HexViewParamHelper.initNewParam(viewId3);
  HexViewParamHelper.setNewValue(KEY_PARAM_A, paramValueA3);
  HexViewParamHelper.setNewValue(KEY_PARAM_B, paramValueB3);
  HexViewParamHelper.setNewValue(KEY_PARAM_C, paramValueC3);
  var data3 = HexViewParamHelper.getNewParam();

  var dataInit = HexViewParamHelper.getViewParam();

  var defaultData = {};
  defaultData[HexViewStatFieldType.VIEW_PARAM] = dataInit;

  // mock actions
  var actionUpdate1 = {
    actionType: HexActionType.VIEW_CHANGE,
    method: HexActionMethodType.POST,
    data: {
      viewParam: data1,
    }
  };
  var actionUpdate2 = {
    actionType: HexActionType.VIEW_CHANGE,
    method: HexActionMethodType.POST,
    data: {
      viewParam: data2,
    }
  };
  var actionUpdate3 = {
    actionType: HexActionType.VIEW_CHANGE,
    method: HexActionMethodType.POST,
    data: {
      viewParam: data3,
    }
  };
  var actionUpdateNull = {
    actionType: HexActionType.VIEW_CHANGE,
    method: HexActionMethodType.POST,
    data: {
      viewParam: null,
    }
  };

  var actionUpdateHistory = {
    actionType: HexActionType.VIEW_CHANGE,
    method: HexActionMethodType.POST,
    data: {
      viewParam: data1,
      history: [data2, data3, data1]
    }
  };

  var actionUpdateOnlyHistory = {
    actionType: HexActionType.VIEW_CHANGE,
    method: HexActionMethodType.POST,
    data: {
      viewParam: undefined,
      history: [data2, data3, data1]
    }
  };

  var actionUpdateHistorySingle = {
    actionType: HexActionType.VIEW_CHANGE,
    method: HexActionMethodType.POST,
    data: {
      viewParam: data1,
      history: data3
    }
  };

  var actionResetStore = {
    actionType: HexActionType.RESET_STORE
  };

  beforeEach(function() {
    HexViewStatStore.reset();
    HexViewStatStore.setDefaultViewId(DEFAULT_VIEW);
    callback = HexDispatcher.register.mock.calls[0][0];

    HexStoreTestHelper.setStore(HexViewStatStore);
    HexStoreTestHelper.setDispatchFunc(callback);
    HexStoreTestHelper.setFieldTypeDef(HexViewStatFieldType);
  });

  it('should have id', function() {
    expect(HexViewStatStore.getId().length > 0).toBe(true);
  });

  it('registers a callback with the dispatcher', function() {
    expect(HexDispatcher.register.mock.calls.length).toBe(1);
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

  it('Post / no history - success', function() {
    HexStoreTestHelper.testMapPost(
      [actionUpdate1, actionUpdate2, actionUpdate3],
      [data1, data2, data3],
      'getViewParam');

    HexViewStatStore.reset();

    HexStoreTestHelper.testMapPost(
      [actionUpdate1, actionUpdate2, actionUpdate3],
      [[dataInit], [dataInit, data1], [dataInit, data1, data2]],
      'getViewHistory');
  });

  it('Post / null - not changed', function() {
    HexStoreTestHelper.testMapPost(
      [actionUpdate1, actionUpdateNull],
      [data1, data1],
      'getViewParam');

    HexViewStatStore.reset();

    HexStoreTestHelper.testMapPost(
      [actionUpdate1, actionUpdateNull],
      [[dataInit], [dataInit]],
      'getViewHistory');
  });

  it('Post / no view param - success', function() {

    HexStoreTestHelper.testMapPost(
      [actionUpdate1, actionUpdateOnlyHistory],
      [data1, data1],
      'getViewParam');

    HexViewStatStore.clearHistory();

    HexStoreTestHelper.testMapPost(
      [actionUpdateOnlyHistory],
      [[data2, data3, data1]],
      'getViewHistory');

  });

  it('Post / single history - success', function() {
    HexStoreTestHelper.testMapPost(
      [actionUpdateHistorySingle],
      [[data3]],
      'getViewHistory');
  });

  it('Post / multi history - success', function() {
    HexStoreTestHelper.testMapPost(
      [actionUpdateHistory],
      [[data2, data3, data1]],
      'getViewHistory');
  });

  it('clearHistory  - success', function() {
    HexStoreTestHelper.testMapPost(
      [actionUpdateHistory],
      [[data2, data3, data1]],
      'getViewHistory');

    HexViewStatStore.clearHistory();
    expect(HexViewStatStore.getViewHistory()).toEqual([]);
  });

  it('Reset Store', function() {
    HexStoreTestHelper.testMapPost(
      [actionUpdateHistory],
      [[data2, data3, data1]],
      'getViewHistory');

    callback(actionResetStore);
    expect(HexViewStatStore.getViewHistory()).toEqual([]);
  });

});
