'use strict';

jest.mock('../../tools/hex.logger');

global.require = require;

var Immutable = require('immutable');

describe('HexL10nMgr', function() {
  var HexL10nMgr = require('../hex.l10n.mgr');

  beforeEach(function() {
    HexL10nMgr.reset();
  });

  afterEach(function() {

  });

  const KEY1 = 'key1';
  const KEY2 = 'key2';
  const KEY3 = 'key3';
  const KEY4 = 'key4';
  const KEY5 = 'key5';
  const KEY_NOT_SET = 'key_not_set';

  var data1 = {};
  data1[KEY1] = 'res1_1';
  data1[KEY2] = 'res1_2';
  data1[KEY3] = 'res1_3';
  data1[KEY4] = 'res1_4';
  data1[KEY5] = 'res1_5';

  var data2 = {};
  data2[KEY1] = 'res2_1';
  data2[KEY2] = 'res2_2';
  data2[KEY3] = 'res2_3';
  data2[KEY4] = 'res2_4';
  data2[KEY5] = 'res2_5';

  var data3 = {};
  data3[KEY1] = 'res3_1';
  data3[KEY2] = 'res3_2';
  data3[KEY3] = 'res3_3';
  data3[KEY4] = 'res3_4';
  data3[KEY5] = 'res3_5';

  var langList = [KEY1, KEY2, KEY3];

  var storeData1 =  Immutable.fromJS(data1);
  var storeData2 =  Immutable.fromJS(data2);
  var storeData3 =  Immutable.fromJS(data3);

  it('init status', function() {
    expect(HexL10nMgr.getRev()).toEqual(-1);
    expect(HexL10nMgr.getMap()).toEqual(null);
    expect(HexL10nMgr.getLangList()).toEqual(null);

    expect(HexL10nMgr.getMap(true)).toEqual({});
    expect(HexL10nMgr.getLangList(true)).toEqual([]);

    expect(HexL10nMgr.get(KEY1)).toEqual(KEY1);
    expect(HexL10nMgr.get(KEY1, true)).toEqual(true);

  });

  it('set / getRev', function() {
    HexL10nMgr.set(storeData1);
    expect(HexL10nMgr.getRev()).toEqual(0);
    HexL10nMgr.set(storeData2);
    expect(HexL10nMgr.getRev()).toEqual(1);
    HexL10nMgr.set(storeData3);
    expect(HexL10nMgr.getRev()).toEqual(2);

    for (var i = 0; i < 100; i++) {
      // not gonna change, same source!
      HexL10nMgr.set(storeData3);
      expect(HexL10nMgr.getRev()).toEqual(2);
    }
  });

  it('setLangList / getLangList', function() {
    HexL10nMgr.setLangList(langList);
    expect(HexL10nMgr.getLangList()).toEqual(langList);
    HexL10nMgr.setLangList(null);
    expect(HexL10nMgr.getLangList()).toEqual(langList);
  });

  it('set / get', function() {
    HexL10nMgr.set(storeData1);
    expect(HexL10nMgr.get(KEY1)).toEqual(data1[KEY1]);
    expect(HexL10nMgr.get(KEY2)).toEqual(data1[KEY2]);
    expect(HexL10nMgr.get(KEY3)).toEqual(data1[KEY3]);
    expect(HexL10nMgr.get(KEY4)).toEqual(data1[KEY4]);
    expect(HexL10nMgr.get(KEY5)).toEqual(data1[KEY5]);
    expect(HexL10nMgr.get(KEY_NOT_SET)).toEqual(KEY_NOT_SET);

    HexL10nMgr.set(storeData2);
    expect(HexL10nMgr.get(KEY1)).toEqual(data2[KEY1]);
    expect(HexL10nMgr.get(KEY2)).toEqual(data2[KEY2]);
    expect(HexL10nMgr.get(KEY3)).toEqual(data2[KEY3]);
    expect(HexL10nMgr.get(KEY4)).toEqual(data2[KEY4]);
    expect(HexL10nMgr.get(KEY5)).toEqual(data2[KEY5]);
    expect(HexL10nMgr.get(KEY_NOT_SET)).toEqual(KEY_NOT_SET);

    HexL10nMgr.set(storeData3);
    expect(HexL10nMgr.get(KEY1)).toEqual(data3[KEY1]);
    expect(HexL10nMgr.get(KEY2)).toEqual(data3[KEY2]);
    expect(HexL10nMgr.get(KEY3)).toEqual(data3[KEY3]);
    expect(HexL10nMgr.get(KEY4)).toEqual(data3[KEY4]);
    expect(HexL10nMgr.get(KEY5)).toEqual(data3[KEY5]);
    expect(HexL10nMgr.get(KEY_NOT_SET)).toEqual(KEY_NOT_SET);

  });

});
