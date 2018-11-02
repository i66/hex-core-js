'use strict';

jest.autoMockOff();

var GokuValidator = require('../hex.validator');

describe('GokuValidator', function() {

  describe('GokuValidator - ensurePercent', function() {

    it('0 -> 0', function() {
      expect(
        GokuValidator.ensurePercent(0)
      ).toEqual(0);
    });

    it('100 -> 100', function() {
      expect(
        GokuValidator.ensurePercent(100)
      ).toEqual(100);
    });

    it('-1 -> 0', function() {
      expect(
        GokuValidator.ensurePercent(-1)
      ).toEqual(0);
    });

    it('101 -> 100', function() {
      expect(
        GokuValidator.ensurePercent(101)
      ).toEqual(100);
    });

    it('50 -> 50', function() {
      expect(
        GokuValidator.ensurePercent(50)
      ).toEqual(50);
    });

    it('"" -> 0', function() {
      expect(
        GokuValidator.ensurePercent(parseFloat(''))
      ).toEqual(0);
    });

    it('null -> 0', function() {
      expect(
        GokuValidator.ensurePercent(null)
      ).toEqual(0);
    });

    it('undefined -> 0', function() {
      var undef;
      expect(
        GokuValidator.ensurePercent(undef)
      ).toEqual(0);
    });

  });

  describe('GokuValidator - ensureRange', function() {

    it('in range', function() {
      expect(
        GokuValidator.ensureRange(0, 100, 50)
      ).toEqual(50);
    });

    it('out low range', function() {
      expect(
        GokuValidator.ensureRange(0, 100, -10)
      ).toEqual(0);
    });

    it('out high range', function() {
      expect(
        GokuValidator.ensureRange(0, 100, 110)
      ).toEqual(100);
    });

    it('out range - ""', function() {
      expect(
        GokuValidator.ensureRange(5, 100, parseFloat(''))
      ).toEqual(5);
    });

    it('out range - null', function() {
      expect(
        GokuValidator.ensureRange(5, 100, null)
      ).toEqual(5);
    });

    it('out range - undefined', function() {
      var undef;
      expect(
        GokuValidator.ensureRange(5, 100, undef)
      ).toEqual(5);
    });

  });

  describe('GokuValidator - ensurePositive', function() {

    it('zero', function() {
      expect(
        GokuValidator.ensurePositive(0, 500)
      ).toEqual(0);
    });

    it('positive', function() {
      expect(
        GokuValidator.ensurePositive(-1, 500)
      ).toEqual(500);
    });

    it('positive', function() {
      expect(
        GokuValidator.ensurePositive(200, 500)
      ).toEqual(200);
    });

    it('empty', function() {
      expect(
        GokuValidator.ensurePositive(parseFloat(''), 99)
      ).toEqual(99);
    });

    it('null', function() {
      expect(
        GokuValidator.ensurePositive(null, 99)
      ).toEqual(99);
    });

    it('undefined', function() {
      var undef;
      expect(
        GokuValidator.ensurePositive(undef, 99)
      ).toEqual(99);
    });

  });

  describe('GokuValidator - ensureBoolean', function() {

    it('0', function() {
      expect(
        GokuValidator.ensureBoolean(0, false)
      ).not.toBeTruthy();
    });

    it('1', function() {
      expect(
        GokuValidator.ensureBoolean(1, false)
      ).toBeTruthy();
    });

    it('number -> default/false', function() {
      expect(
        GokuValidator.ensureBoolean(123, false)
      ).not.toBeTruthy();
    });

    it('number -> default/true', function() {
      expect(
        GokuValidator.ensureBoolean(123, true)
      ).toBeTruthy();
    });

    it('null -> default/true', function() {
      expect(
        GokuValidator.ensureBoolean(null, true)
      ).toBeTruthy();
    });

    it('undefined -> default/true', function() {
      var undef;
      expect(
        GokuValidator.ensureBoolean(undef, true)
      ).toBeTruthy();
    });

  });

  describe('GokuValidator - ensureString', function() {

    it('string', function() {
      expect(
        GokuValidator.ensureString('test', '')
      ).toEqual('test');
    });

    it('null -> default', function() {
      expect(
        GokuValidator.ensureString(null, 'back')
      ).toEqual('back');
    });

    it('undefined -> default', function() {
      var undef;
      expect(
        GokuValidator.ensureString(undef, 'back')
      ).toEqual('back');
    });

  });

  describe('GokuValidator - ensureCollection', function() {

    it('in array', function() {
      expect(
        GokuValidator.ensureCollection([0,1,2], 2, 99)
      ).toEqual(2);
    });

    it('in hash', function() {
      expect(
        GokuValidator.ensureCollection({a: 1, b: 2, c: 0}, 2, 99)
      ).toEqual(2);
    });

    it('empty array', function() {
      expect(
        GokuValidator.ensureCollection([], 2, 3)
      ).toEqual(3);
    });

    it('empty hash', function() {
      expect(
        GokuValidator.ensureCollection({}, 2, 3)
      ).toEqual(3);
    });

    it('null collection', function() {
      expect(
        GokuValidator.ensureCollection(null, 'test', 'back')
      ).toEqual('back');
    });

    it('null collection, null value', function() {
      expect(
        GokuValidator.ensureCollection(null, null, 'back')
      ).toEqual('back');
    });

    it('undefined collection', function() {
      var undef;
      expect(
        GokuValidator.ensureCollection(undef, 'found', 'back')
      ).toEqual('back');
    });

    it('undefined value', function() {
      var undef;
      expect(
        GokuValidator.ensureCollection([], undef, 'back')
      ).toEqual('back');
    });

  });

  describe('GokuValidator - ensureNumber', function() {

    it('normal positive', function() {
      expect(
        GokuValidator.ensureNumber(100, 9)
      ).toEqual(100);
    });

    it('normal negative', function() {
      expect(
        GokuValidator.ensureNumber(-100, 9)
      ).toEqual(-100);
    });

    it('string positive', function() {
      expect(
        GokuValidator.ensureNumber('100', 9)
      ).toEqual(100);
    });

    it('string negative', function() {
      expect(
        GokuValidator.ensureNumber('-100', 9)
      ).toEqual(-100);
    });

    it('string nonnum', function() {
      expect(
        GokuValidator.ensureNumber('abc', 9)
      ).toEqual(9);
    });

    it('string nonnum', function() {
      expect(
        GokuValidator.ensureNumber('abc', 9)
      ).toEqual(9);
    });

    it('null nonnum', function() {
      expect(
        GokuValidator.ensureNumber(null, 9)
      ).toEqual(9);
    });

    it('undefined nonnum', function() {
      var undef;
      expect(
        GokuValidator.ensureNumber(undef, 9)
      ).toEqual(9);
    });

  });

  describe('GokuValidator - ensureInt', function() {

    it('normal positive', function() {
      expect(
        GokuValidator.ensureInt(100, 9)
      ).toEqual(100);
    });

    it('float positive', function() {
      expect(
        GokuValidator.ensureInt(100.9, 9)
      ).toEqual(100);
    });

    it('normal negative', function() {
      expect(
        GokuValidator.ensureInt(-100, 9)
      ).toEqual(-100);
    });

    it('float negative', function() {
      expect(
        GokuValidator.ensureInt(-100.5, 9)
      ).toEqual(-100);
    });

    it('string positive', function() {
      expect(
        GokuValidator.ensureInt('100', 9)
      ).toEqual(100);
    });

    it('string negative', function() {
      expect(
        GokuValidator.ensureInt('-100', 9)
      ).toEqual(-100);
    });

    it('string float positive', function() {
      expect(
        GokuValidator.ensureInt('100.123', 9)
      ).toEqual(100);
    });

    it('string float negative', function() {
      expect(
        GokuValidator.ensureInt('-100.232', 9)
      ).toEqual(-100);
    });

    it('string nonnum', function() {
      expect(
        GokuValidator.ensureInt('abc', 9)
      ).toEqual(9);
    });

    it('string nonnum', function() {
      expect(
        GokuValidator.ensureInt('abc', 9)
      ).toEqual(9);
    });

    it('null nonnum', function() {
      expect(
        GokuValidator.ensureInt(null, 9)
      ).toEqual(9);
    });

    it('undefined nonnum', function() {
      var undef;
      expect(
        GokuValidator.ensureInt(undef, 9)
      ).toEqual(9);
    });

  });

  describe('GokuValidator - ensureArray', function() {

    it('Array - empty', function() {
      expect(
        GokuValidator.ensureArray([], null)
      ).toEqual([]);
    });

    it('Array - number', function() {
      expect(
        GokuValidator.ensureArray([1, 2, 3], [])
      ).toEqual([1, 2, 3]);
    });

    it('Array - string', function() {
      expect(
        GokuValidator.ensureArray(['123', '34', '454'], [])
      ).toEqual(['123', '34', '454']);
    });

    it('Array - mixed', function() {
      expect(
        GokuValidator.ensureArray([123, '34', false], [])
      ).toEqual([123, '34', false]);
    });

    it('Array of Array', function() {
      expect(
        GokuValidator.ensureArray([[123], ['34'], [false]], [])
      ).toEqual([[123], ['34'], [false]]);
    });

    it('object', function() {
      expect(
        GokuValidator.ensureArray({a: 100}, [])
      ).toEqual([]);
    });

    it('normal positive', function() {
      expect(
        GokuValidator.ensureArray(100, [])
      ).toEqual([]);
    });

    it('float positive', function() {
      expect(
        GokuValidator.ensureArray(100.9, [])
      ).toEqual([]);
    });

    it('normal negative', function() {
      expect(
        GokuValidator.ensureArray(-100, [])
      ).toEqual([]);
    });

    it('float negative', function() {
      expect(
        GokuValidator.ensureArray(-100.5, [])
      ).toEqual([]);
    });

    it('string positive', function() {
      expect(
        GokuValidator.ensureArray('100', [])
      ).toEqual([]);
    });

    it('string negative', function() {
      expect(
        GokuValidator.ensureArray('-100', [])
      ).toEqual([]);
    });

    it('string float positive', function() {
      expect(
        GokuValidator.ensureArray('100.123', [])
      ).toEqual([]);
    });

    it('string float negative', function() {
      expect(
        GokuValidator.ensureArray('-100.232', [])
      ).toEqual([]);
    });

    it('string nonnum', function() {
      expect(
        GokuValidator.ensureInt('abc', [])
      ).toEqual([]);
    });

    it('string nonnum', function() {
      expect(
        GokuValidator.ensureInt('abc', [])
      ).toEqual([]);
    });

    it('null nonnum', function() {
      expect(
        GokuValidator.ensureInt(null, [])
      ).toEqual([]);
    });

    it('undefined nonnum', function() {
      var undef;
      expect(
        GokuValidator.ensureInt(undef, [])
      ).toEqual([]);
    });

  });

  describe('GokuValidator - ensureObject', function() {

    it('object', function() {
      expect(
        GokuValidator.ensureObject({a: 100}, null)
      ).toEqual({a: 100});
    });

    it('Array - empty', function() {
      expect(
        GokuValidator.ensureObject([], null)
      ).toEqual(null);
    });

    it('Array - number', function() {
      expect(
        GokuValidator.ensureObject([1, 2, 3], null)
      ).toEqual(null);
    });

    it('normal positive', function() {
      expect(
        GokuValidator.ensureObject(100, null)
      ).toEqual(null);
    });

    it('float positive', function() {
      expect(
        GokuValidator.ensureArray(100.9, null)
      ).toEqual(null);
    });

    it('normal negative', function() {
      expect(
        GokuValidator.ensureArray(-100, null)
      ).toEqual(null);
    });

    it('float negative', function() {
      expect(
        GokuValidator.ensureArray(-100.5, null)
      ).toEqual(null);
    });

    it('string positive', function() {
      expect(
        GokuValidator.ensureArray('100', null)
      ).toEqual(null);
    });

    it('string negative', function() {
      expect(
        GokuValidator.ensureArray('-100', null)
      ).toEqual(null);
    });

    it('null nonnum', function() {
      expect(
        GokuValidator.ensureArray(null, {})
      ).toEqual({});
    });

    it('undefined nonnum', function() {
      var undef;
      expect(
        GokuValidator.ensureArray(undef, null)
      ).toEqual(null);
    });

  });

});
