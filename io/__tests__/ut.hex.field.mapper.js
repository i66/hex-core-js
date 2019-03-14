'use strict';

jest.autoMockOff();

global.require = require;

describe('HexFieldMapper', function() {
  var HexFieldMapper = require('../hex.field.mapper');

  beforeEach(function() {
  });

  afterEach(function() {
    HexFieldMapper.reset();
  });

  var keyField = {
    FIELD_1: 'field_1',
    FIELD_2: 'field_2',
    FIELD_3: 'field_3',
    FIELD_4: 'field_4',
    FIELD_5: 'field_5'
  };

  var mapField = {
    MAP_1: 'map_1',
    MAP_2: 'map_2',
    MAP_3: 'map_3',
    MAP_4: 'map_4',
    MAP_5: 'map_5'
  };

  var rawData = {};
  rawData[mapField.MAP_1] = 'test_res_1';
  rawData[mapField.MAP_2] = 'test_res_2';
  rawData[mapField.MAP_3] = 'test_res_3';
  rawData[mapField.MAP_4] = 'test_res_4';
  rawData[mapField.MAP_5] = 'test_res_5';

  var rawDataMiss = {};
  rawDataMiss[mapField.MAP_1] = 'test_res_1';
  rawDataMiss[mapField.MAP_2] = 'test_res_2';
  rawDataMiss[mapField.MAP_5] = 'test_res_5';

  it('set/get - normal', function() {
    HexFieldMapper.set(keyField.FIELD_1, mapField.MAP_1);
    HexFieldMapper.set(keyField.FIELD_2, mapField.MAP_2);
    HexFieldMapper.set(keyField.FIELD_3, mapField.MAP_3);
    HexFieldMapper.set(keyField.FIELD_4, mapField.MAP_4);
    HexFieldMapper.set(keyField.FIELD_5, mapField.MAP_5);

    expect(HexFieldMapper.get(keyField.FIELD_1)).toEqual(mapField.MAP_1);
    expect(HexFieldMapper.get(keyField.FIELD_2)).toEqual(mapField.MAP_2);
    expect(HexFieldMapper.get(keyField.FIELD_3)).toEqual(mapField.MAP_3);
    expect(HexFieldMapper.get(keyField.FIELD_4)).toEqual(mapField.MAP_4);
    expect(HexFieldMapper.get(keyField.FIELD_5)).toEqual(mapField.MAP_5);
  });

  it('set - replace', function() {
    HexFieldMapper.set(keyField.FIELD_1, mapField.MAP_1);
    expect(HexFieldMapper.get(keyField.FIELD_1)).toEqual(mapField.MAP_1);

    HexFieldMapper.set(keyField.FIELD_1, mapField.MAP_2);
    expect(HexFieldMapper.get(keyField.FIELD_1)).toEqual(mapField.MAP_2);
  });

  it('get - not found', function() {
    expect(HexFieldMapper.get(keyField.FIELD_1)).toBe(null);
    expect(HexFieldMapper.get(keyField.FIELD_2)).toBe(null);
    expect(HexFieldMapper.get(keyField.FIELD_3)).toBe(null);
    expect(HexFieldMapper.get(keyField.FIELD_4)).toBe(null);
    expect(HexFieldMapper.get(keyField.FIELD_5)).toBe(null);
  });

  it('clear - not found', function() {
    expect(HexFieldMapper.clear(keyField.FIELD_1)).toBe(false);
    expect(HexFieldMapper.clear(keyField.FIELD_2)).toBe(false);
    expect(HexFieldMapper.clear(keyField.FIELD_3)).toBe(false);
    expect(HexFieldMapper.clear(keyField.FIELD_4)).toBe(false);
    expect(HexFieldMapper.clear(keyField.FIELD_5)).toBe(false);
  });

  it('set/get/clear - normal', function() {
    HexFieldMapper.set(keyField.FIELD_1, mapField.MAP_1);
    HexFieldMapper.set(keyField.FIELD_2, mapField.MAP_2);
    HexFieldMapper.set(keyField.FIELD_3, mapField.MAP_3);
    HexFieldMapper.set(keyField.FIELD_4, mapField.MAP_4);
    HexFieldMapper.set(keyField.FIELD_5, mapField.MAP_5);

    expect(HexFieldMapper.get(keyField.FIELD_1)).toEqual(mapField.MAP_1);
    expect(HexFieldMapper.get(keyField.FIELD_2)).toEqual(mapField.MAP_2);
    expect(HexFieldMapper.get(keyField.FIELD_3)).toEqual(mapField.MAP_3);
    expect(HexFieldMapper.get(keyField.FIELD_4)).toEqual(mapField.MAP_4);
    expect(HexFieldMapper.get(keyField.FIELD_5)).toEqual(mapField.MAP_5);

    expect(HexFieldMapper.clear(keyField.FIELD_1)).toBe(true);
    expect(HexFieldMapper.clear(keyField.FIELD_2)).toBe(true);
    expect(HexFieldMapper.clear(keyField.FIELD_3)).toBe(true);
    expect(HexFieldMapper.clear(keyField.FIELD_4)).toBe(true);
    expect(HexFieldMapper.clear(keyField.FIELD_5)).toBe(true);

    expect(HexFieldMapper.get(keyField.FIELD_1)).toBe(null);
    expect(HexFieldMapper.get(keyField.FIELD_2)).toBe(null);
    expect(HexFieldMapper.get(keyField.FIELD_3)).toBe(null);
    expect(HexFieldMapper.get(keyField.FIELD_4)).toBe(null);
    expect(HexFieldMapper.get(keyField.FIELD_5)).toBe(null);
  });

  it('mapDataKeySingle - all found', function() {
    HexFieldMapper.set(keyField.FIELD_1, mapField.MAP_1);
    HexFieldMapper.set(keyField.FIELD_2, mapField.MAP_2);
    HexFieldMapper.set(keyField.FIELD_3, mapField.MAP_3);
    HexFieldMapper.set(keyField.FIELD_4, mapField.MAP_4);
    HexFieldMapper.set(keyField.FIELD_5, mapField.MAP_5);

    var res = HexFieldMapper.mapDataKeySingle(rawData, keyField);
    expect(res[keyField.FIELD_1]).toBe(rawData[mapField.MAP_1]);
    expect(res[keyField.FIELD_2]).toBe(rawData[mapField.MAP_2]);
    expect(res[keyField.FIELD_3]).toBe(rawData[mapField.MAP_3]);
    expect(res[keyField.FIELD_4]).toBe(rawData[mapField.MAP_4]);
    expect(res[keyField.FIELD_5]).toBe(rawData[mapField.MAP_5]);
  });

  it('mapDataKeySingle - partial not set', function() {
    HexFieldMapper.set(keyField.FIELD_1, mapField.MAP_1);
    HexFieldMapper.set(keyField.FIELD_2, mapField.MAP_2);
    HexFieldMapper.set(keyField.FIELD_3, mapField.MAP_3);

    var res = HexFieldMapper.mapDataKeySingle(rawData, keyField);
    expect(res[keyField.FIELD_1]).toBe(rawData[mapField.MAP_1]);
    expect(res[keyField.FIELD_2]).toBe(rawData[mapField.MAP_2]);
    expect(res[keyField.FIELD_3]).toBe(rawData[mapField.MAP_3]);
    expect(res[keyField.FIELD_4]).toBe(undefined);
    expect(res[keyField.FIELD_5]).toBe(undefined);
  });

  it('mapDataKeySingle - missing data', function() {
    HexFieldMapper.set(keyField.FIELD_1, mapField.MAP_1);
    HexFieldMapper.set(keyField.FIELD_2, mapField.MAP_2);
    HexFieldMapper.set(keyField.FIELD_3, mapField.MAP_3);
    HexFieldMapper.set(keyField.FIELD_4, mapField.MAP_4);
    HexFieldMapper.set(keyField.FIELD_5, mapField.MAP_5);

    var res = HexFieldMapper.mapDataKeySingle(rawDataMiss, keyField);

    expect(res[keyField.FIELD_1]).toBe(rawData[mapField.MAP_1]);
    expect(res[keyField.FIELD_2]).toBe(rawData[mapField.MAP_2]);
    expect(res[keyField.FIELD_3]).toBe(undefined);
    expect(res[keyField.FIELD_4]).toBe(undefined);
    expect(res[keyField.FIELD_5]).toBe(rawData[mapField.MAP_5]);
  });

  it('mapDataKeyAry - all found', function() {
    HexFieldMapper.set(keyField.FIELD_1, mapField.MAP_1);
    HexFieldMapper.set(keyField.FIELD_2, mapField.MAP_2);
    HexFieldMapper.set(keyField.FIELD_3, mapField.MAP_3);
    HexFieldMapper.set(keyField.FIELD_4, mapField.MAP_4);
    HexFieldMapper.set(keyField.FIELD_5, mapField.MAP_5);

    var rawDataAry = [rawData, rawData, rawData, rawData, rawData];

    var res = HexFieldMapper.mapDataKeyAry(rawDataAry, keyField);
    for (var i = 0; i < res.length; i++) {
      expect(res[i][keyField.FIELD_1]).toBe(rawData[mapField.MAP_1]);
      expect(res[i][keyField.FIELD_2]).toBe(rawData[mapField.MAP_2]);
      expect(res[i][keyField.FIELD_3]).toBe(rawData[mapField.MAP_3]);
      expect(res[i][keyField.FIELD_4]).toBe(rawData[mapField.MAP_4]);
      expect(res[i][keyField.FIELD_5]).toBe(rawData[mapField.MAP_5]);
    }
  });

  it('mapDataKey - single all found', function() {
    HexFieldMapper.set(keyField.FIELD_1, mapField.MAP_1);
    HexFieldMapper.set(keyField.FIELD_2, mapField.MAP_2);
    HexFieldMapper.set(keyField.FIELD_3, mapField.MAP_3);
    HexFieldMapper.set(keyField.FIELD_4, mapField.MAP_4);
    HexFieldMapper.set(keyField.FIELD_5, mapField.MAP_5);

    var res = HexFieldMapper.mapDataKey(rawData, keyField);
    expect(res[keyField.FIELD_1]).toBe(rawData[mapField.MAP_1]);
    expect(res[keyField.FIELD_2]).toBe(rawData[mapField.MAP_2]);
    expect(res[keyField.FIELD_3]).toBe(rawData[mapField.MAP_3]);
    expect(res[keyField.FIELD_4]).toBe(rawData[mapField.MAP_4]);
    expect(res[keyField.FIELD_5]).toBe(rawData[mapField.MAP_5]);
  });

  it('mapDataKey - array all found', function() {
    HexFieldMapper.set(keyField.FIELD_1, mapField.MAP_1);
    HexFieldMapper.set(keyField.FIELD_2, mapField.MAP_2);
    HexFieldMapper.set(keyField.FIELD_3, mapField.MAP_3);
    HexFieldMapper.set(keyField.FIELD_4, mapField.MAP_4);
    HexFieldMapper.set(keyField.FIELD_5, mapField.MAP_5);

    var rawDataAry = [rawData, rawData, rawData, rawData, rawData];

    var res = HexFieldMapper.mapDataKeyAry(rawDataAry, keyField);
    for (var i = 0; i < res.length; i++) {
      expect(res[i][keyField.FIELD_1]).toBe(rawData[mapField.MAP_1]);
      expect(res[i][keyField.FIELD_2]).toBe(rawData[mapField.MAP_2]);
      expect(res[i][keyField.FIELD_3]).toBe(rawData[mapField.MAP_3]);
      expect(res[i][keyField.FIELD_4]).toBe(rawData[mapField.MAP_4]);
      expect(res[i][keyField.FIELD_5]).toBe(rawData[mapField.MAP_5]);
    }
  });

});
