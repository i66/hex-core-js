'use strict';

jest.mock('../../tools/hex.logger');

global.require = require;

describe('HexCoreDataCounter', function() {
  var HexCoreDataCounter = require('../hex.core.data.counter');

  beforeEach(function() {
    HexCoreDataCounter.reset();
  });

  afterEach(function() {

  });

  var dataType1 = 'dataType1';
  var dataType2 = 'dataType2';
  var dataType3 = 'dataType3';

  it('get / set', function() {
    expect(HexCoreDataCounter.get()).toEqual(-1);
    expect(HexCoreDataCounter.get(dataType1)).toEqual(-1);
    expect(HexCoreDataCounter.get(dataType2)).toEqual(-1);
    expect(HexCoreDataCounter.get(dataType3)).toEqual(-1);

    for (var i = 0; i < 100; i++) {
      HexCoreDataCounter.set(dataType1, i);
      HexCoreDataCounter.set(dataType2, i * 10);
      HexCoreDataCounter.set(dataType3, i * 100);

      expect(HexCoreDataCounter.get(dataType1)).toEqual(i);
      expect(HexCoreDataCounter.get(dataType2)).toEqual(i * 10);
      expect(HexCoreDataCounter.get(dataType3)).toEqual(i * 100);
    }
  });

  it('get / update', function() {
    expect(HexCoreDataCounter.get()).toEqual(-1);
    expect(HexCoreDataCounter.get(dataType1)).toEqual(-1);
    expect(HexCoreDataCounter.get(dataType2)).toEqual(-1);
    expect(HexCoreDataCounter.get(dataType3)).toEqual(-1);

    for (var i = 0; i < 100; i++) {
      HexCoreDataCounter.update(dataType1);
      HexCoreDataCounter.update(dataType2);
      HexCoreDataCounter.update(dataType3);

      expect(HexCoreDataCounter.get(dataType1)).toEqual(i);
      expect(HexCoreDataCounter.get(dataType2)).toEqual(i);
      expect(HexCoreDataCounter.get(dataType3)).toEqual(i);
    }
  });

  it('reset', function() {
    expect(HexCoreDataCounter.get()).toEqual(-1);
    expect(HexCoreDataCounter.get(dataType1)).toEqual(-1);
    expect(HexCoreDataCounter.get(dataType2)).toEqual(-1);
    expect(HexCoreDataCounter.get(dataType3)).toEqual(-1);

    for (var i = 0; i < 100; i++) {
      HexCoreDataCounter.update(dataType1);
      HexCoreDataCounter.update(dataType2);
      HexCoreDataCounter.update(dataType3);
    }

    expect(HexCoreDataCounter.get(dataType1)).toEqual(i - 1);
    expect(HexCoreDataCounter.get(dataType2)).toEqual(i - 1);
    expect(HexCoreDataCounter.get(dataType3)).toEqual(i - 1);

    HexCoreDataCounter.reset();
    expect(HexCoreDataCounter.get(dataType1)).toEqual(-1);
    expect(HexCoreDataCounter.get(dataType2)).toEqual(-1);
    expect(HexCoreDataCounter.get(dataType3)).toEqual(-1);
  });

});
