'use strict';

jest.mock('../../dispatcher/hex.dispatcher');
jest.mock('../../tools/hex.logger');

global.require = require;

describe('HexPrefStore', function() {

  var checker = require('../../tools/hex.checker');
  var logger = require('../../tools/hex.logger');
  var HexActionType = require('../../types/hex.action.type');
  var L10N = require('../../types/hex.l10n.type');
  var HexStoreTestHelper = require('../hex.store.test.helper');
  var HexFileMgr = require('../../io/hex.file.mgr.factory').getInstance();
  var HexDispatcher = require('../../dispatcher/hex.dispatcher');
  var HexLangStore = require('../hex.lang.store');
  var HexActionType = require('../../types/hex.action.type');

  var callback;

  var actionResetStore = {
    actionType: HexActionType.RESET_STORE
  };

  beforeEach(function() {
    HexLangStore.reset();
    callback = HexDispatcher.register.mock.calls[0][0];

    HexStoreTestHelper.setStore(HexLangStore);
    HexStoreTestHelper.setDispatchFunc(callback);
  });

  it('should have id', function() {
    expect(HexLangStore.getId().length > 0).toBe(true);
  });

  it('registers a callback with the dispatcher', function() {
    expect(HexDispatcher.register.mock.calls.length).toBe(1);
  });

  it('should initialize with default data', function() {
    expect(checker.isArray(HexLangStore.getList())).toBe(true);
    expect(HexLangStore.getList().length).toBe(0);

    // Return key if not found
    var testKey = 'TEST';
    expect(HexLangStore.getAll().getRes(testKey)).toBe(testKey);
  });

  it('edit return data should not affect original', function() {
    var langList = HexLangStore.getList();
    var orgLangList = langList.slice(0);
    langList.push('NON');
    langList[0] = 'NON';

    expect(HexLangStore.getList()).toEqual(orgLangList);
  });

  it('addChangeListener / removeChangeListener / emitChange', function() {
    HexStoreTestHelper.checkListener();
  });

  it('setLang', function() {
    var langList = HexLangStore.getList();
    var data;
    for (var i = 0; i < langList.length; i++) {
      HexLangStore.setLang(langList[i]);
      data = HexLangStore.getAll();
      expect(data.get(L10N.LANG_ID)).toEqual(langList[i]);
    }
  });

  it('Lang Change - Success', function() {
    var langList = HexLangStore.getList();
    var data;
    for (var i = 0; i < langList.length; i++) {
      var actionLangChange = {
        actionType: HexActionType.LANG_CHANGE,
        data: langList[i]
      };

      callback(actionLangChange);
      data = HexLangStore.getAll();
      expect(data.get(L10N.LANG_ID)).toEqual(langList[i]);
    }
  });

  it('Lang Change - Failed', function() {
    var langList = HexLangStore.getList();
    var data;
    var actionLangChange = {
      actionType: HexActionType.LANG_CHANGE,
      data: langList[0]
    };
    callback(actionLangChange);
    data = HexLangStore.getAll();
    expect(data.get(L10N.LANG_ID)).toEqual(langList[0]);

    // Switch to unknown lang
    var actionLangChangeFail = {
      actionType: HexActionType.LANG_CHANGE,
      data: 'EN_UK'
    };
    callback(actionLangChange);
    data = HexLangStore.getAll();
    expect(data.get(L10N.LANG_ID)).toEqual(langList[0]);
  });

  it('Reset Store', function() {
    var langList = HexLangStore.getList();
    var data;

    var actionLangChange = {
      actionType: HexActionType.LANG_CHANGE,
      data: langList[0]
    };

    callback(actionLangChange);
    data = HexLangStore.getAll();
    expect(data.get(L10N.LANG_ID)).toEqual(langList[0]);
    // Should not change
    callback(actionResetStore);
    expect(langList).toEqual(HexLangStore.getList());
    expect(data.get(L10N.LANG_ID)).toEqual(langList[0]);
  });

});
