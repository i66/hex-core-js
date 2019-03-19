'use strict';

jest.mock('../../tools/hex.logger');
var Immutable = require('immutable');
var checker = require('../../tools/hex.checker');

global.require = require;

describe('HexStoreDataMgr', function() {
  var HexStoreDataMgr = require('../hex.store.data.mgr');

  var key1 = 'key_1';
  var key2 = 'key_2';
  var key3 = 'key_3';

  var val1 = 'val_1';
  var val2 = 'val_2';
  var val3 = 'val_3';

  var dataMap = {};
  dataMap[key1] = val1;
  dataMap[key2] = val2;
  dataMap[key3] = val3;

  var dataAry = [val1, val2, val3];

  var dataImmut = Immutable.fromJS(dataMap);

  beforeEach(function() {

  });

  afterEach(function() {

  });

  it('getAry / success', function() {
    var res = HexStoreDataMgr.getAry(dataImmut);
    expect(res).toEqual(dataAry);
  });

  it('getAry / not immut', function() {
    var res = HexStoreDataMgr.getAry(dataAry);
    expect(res).toBe(dataAry);
  });

  it('getAry / default', function() {
    var res = HexStoreDataMgr.getAry(null, []);
    expect(res).toEqual([]);
  });

  it('getMap / success', function() {
    var res = HexStoreDataMgr.getMap(dataImmut);
    expect(res).toEqual(dataMap);
  });

  it('getMap / not immut', function() {
    var res = HexStoreDataMgr.getMap(dataMap);
    expect(res).toBe(dataMap);
  });

  it('getMap / default', function() {
    var res = HexStoreDataMgr.getMap(null, {});
    expect(res).toEqual({});
  });

  it('getMapField / success', function() {
    expect(HexStoreDataMgr.getMapField(dataImmut, key1)).toEqual(val1);
    expect(HexStoreDataMgr.getMapField(dataImmut, key2)).toEqual(val2);
    expect(HexStoreDataMgr.getMapField(dataImmut, key3)).toEqual(val3);
  });

  it('getMapField / not immut', function() {
    expect(HexStoreDataMgr.getMapField(dataMap, key1)).toEqual(val1);
    expect(HexStoreDataMgr.getMapField(dataMap, key2)).toEqual(val2);
    expect(HexStoreDataMgr.getMapField(dataMap, key3)).toEqual(val3);
  });

  it('getMapField / not found', function() {
    expect(HexStoreDataMgr.getMapField(dataMap, 'not_set')).toEqual(undefined);
    expect(HexStoreDataMgr.getMapField(dataMap, 'not_set', null)).toEqual(null);
  });

  it('getImmutMap', function() {
    var res = HexStoreDataMgr.getImmutMap(dataMap);
    expect(checker.isSetNonNull(res.toJS)).toBe(true);
    res = HexStoreDataMgr.getImmutMap();
    expect(checker.isSetNonNull(res.toJS)).toBe(true);
  });


});
