'use strict';

jest.mock('../../dispatcher/hex.dispatcher');
jest.mock('../../tools/hex.logger');

global.require = require;

describe('HexConsoleStore', function() {

  var checker = require('../../tools/hex.checker');
  var logger = require('../../tools/hex.logger');
  var util = require('../../tools/hex.util');
  var HexAppConstant = require('../../types/hex.app.constant');
  var HexActionType = require('../../types/hex.action.type');
  var HexStoreTestHelper = require('../hex.store.test.helper');
  var HexDispatcher = require('../../dispatcher/hex.dispatcher');
  var HexConsoleStore = require('../hex.console.store');
  var HexActionType = require('../../types/hex.action.type');

  var callback;
  var actionToggle = {
    actionType: HexActionType.TOGGLE_CONSOLE
  };

  var actionResetStore = {
    actionType: HexActionType.RESET_STORE
  };

  function checkExceed(exceedVal) {
    var logCallback = logger.register.mock.calls[0][0];
    var logContentAry = [];

    for (var i = 0; i < HexAppConstant.MAX_LOG; i++) {
      logContentAry.push(util.getRandomString(20));
    }

    var listener = jest.fn();
    HexConsoleStore.addChangeListener(listener);

    for (var i = 0; i < HexAppConstant.MAX_LOG; i++) {
      logCallback(logContentAry[i]);
    }

    expect(listener.mock.calls.length).toBe(HexAppConstant.MAX_LOG);
    var data = HexConsoleStore.getAll();

    for (var i = 0; i < HexAppConstant.MAX_LOG; i++) {
      expect(data[i]).toBe(logContentAry[i]);
    }
    expect(data.length).toBe(HexAppConstant.MAX_LOG);

    // Exceed MAX_LOG!
    var exceedVal = 100;
    var logContentExAry = [];
    for (var i = 0; i < exceedVal; i++) {
      logContentExAry.push(util.getRandomString(20));
    }

    for (var i = 0; i < exceedVal; i++) {
      logCallback(logContentExAry[i]);
      data = HexConsoleStore.getAll();
      expect(data[HexAppConstant.MAX_LOG - 1]).toEqual(logContentExAry[i]);
    }

    data = HexConsoleStore.getAll();
    var diff = HexAppConstant.MAX_LOG - exceedVal;

    if (diff > 0) {
      for (var i = 0; i < diff; i++) {
        expect(data[i]).toEqual(logContentAry[exceedVal + i]);
      }
      for (var i = diff; i < HexAppConstant.MAX_LOG; i++) {
        expect(data[i]).toEqual(logContentExAry[i - diff]);
      }
    } else {
      for (var i = 0; i < HexAppConstant.MAX_LOG; i++) {
        expect(data[i]).toEqual(logContentExAry[i - diff]);
      }
    }
  }

  beforeEach(function() {
    HexConsoleStore.reset();
    callback = HexDispatcher.register.mock.calls[0][0];

    HexStoreTestHelper.setStore(HexConsoleStore);
    HexStoreTestHelper.setDispatchFunc(callback);
  });

  it('should have id', function() {
    expect(HexConsoleStore.getId().length > 0).toBe(true);
  });

  it('registers a callback with the dispatcher', function() {
    expect(HexDispatcher.register.mock.calls.length).toBe(1);
  });

  it('should initialize with default data', function() {
    HexStoreTestHelper.checkDefaultVal([]);
  });

  it('edit return data should not affect original', function() {
    HexStoreTestHelper.checkAryIntergrity();
  });

  it('addChangeListener / removeChangeListener / emitChange', function() {
    HexStoreTestHelper.checkListener();
  });

  it('addEventListener / removeEventListener / emitEvent', function() {
    HexStoreTestHelper.checkEventListener();
  });

  it('registers a callback with the logger', function() {
    expect(logger.register.mock.calls.length).toBe(1);
  });

  it('Toggle', function() {
    var listener = jest.fn();
    HexConsoleStore.addEventListener(HexActionType.TOGGLE_CONSOLE, listener);
    callback(actionToggle);
    expect(listener.mock.calls.length).toBe(1);
    callback(actionToggle);
    expect(listener.mock.calls.length).toBe(2);
  });

  it('Log', function() {
    var logCallback = logger.register.mock.calls[0][0];
    var logContentAry = [];
    var curLog;

    var listener = jest.fn();
    HexConsoleStore.addChangeListener(listener);

    for (var i = 0; i < HexAppConstant.MAX_LOG; i++) {
      curLog = util.getRandomString(20);
      logContentAry.push(curLog);
      // Log!
      logCallback(curLog);
    }

    expect(listener.mock.calls.length).toBe(HexAppConstant.MAX_LOG);
    var data = HexConsoleStore.getAll();
    expect(logContentAry).toEqual(data);

  });

  it('Log should reuse elements', function() {
    checkExceed(0);
    checkExceed(10);
    checkExceed(100);
  });

  it('Reset Store', function() {
    var logCallback = logger.register.mock.calls[0][0];
    var logContentAry = [];
    var curLog;

    var listener = jest.fn();
    HexConsoleStore.addChangeListener(listener);

    for (var i = 0; i < HexAppConstant.MAX_LOG; i++) {
      curLog = util.getRandomString(20);
      logContentAry.push(curLog);
      // Log!
      logCallback(curLog);
    }

    expect(listener.mock.calls.length).toBe(HexAppConstant.MAX_LOG);
    // Should have no effect
    callback(actionResetStore);
    var data = HexConsoleStore.getAll();
    expect(logContentAry).toEqual(data);
  });

});
