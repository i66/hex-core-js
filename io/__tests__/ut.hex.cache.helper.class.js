'use strict';

jest.mock('../../tools/hex.logger');

var checker = require('../../tools/hex.checker');

global.require = require;

describe('HexCacheHelperClass', function() {

  var HexCacheHelperClass = require('../hex.cache.helper.class');
  var HexCacheHelper;

  var key1 = 'key1';
  var key2 = 'key2';
  var key3 = 'key3';
  var key4 = 'key4';
  var key5 = 'key5';

  var val1 = 1;
  var val2 = '2';
  var val3 = false;
  var val4 = [1, 2, 3, 4, 5];
  var val5 = {a: 1, b: 2, c: 3};

  beforeEach(function() {
    HexCacheHelper = new HexCacheHelperClass();
  });

  afterEach(function() {
    HexCacheHelper = null;
  });

  it('set / get / reset', function() {
    expect(HexCacheHelper.get()).toEqual(null);
    expect(HexCacheHelper.get(undefined, false)).toEqual(false);

    HexCacheHelper.set(key1, val1);
    HexCacheHelper.set(key2, val2);
    HexCacheHelper.set(key3, val3);
    HexCacheHelper.set(key4, val4);
    HexCacheHelper.set(key5, val5);

    expect(HexCacheHelper.get(key1)).toEqual(val1);
    expect(HexCacheHelper.get(key2)).toEqual(val2);
    expect(HexCacheHelper.get(key3)).toEqual(val3);
    expect(HexCacheHelper.get(key4)).toEqual(val4);
    expect(HexCacheHelper.get(key5)).toEqual(val5);

    HexCacheHelper.reset();

    expect(HexCacheHelper.get(key1)).toEqual(null);
    expect(HexCacheHelper.get(key2)).toEqual(null);
    expect(HexCacheHelper.get(key3)).toEqual(null);
    expect(HexCacheHelper.get(key4)).toEqual(null);
    expect(HexCacheHelper.get(key5)).toEqual(null);
  });

});
