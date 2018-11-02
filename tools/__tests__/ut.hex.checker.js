'use strict';

jest.autoMockOff();

var GokuChecker = require('../hex.checker');

describe('GokuChecker', function() {

  describe('GokuChecker - isNull', function() {

    it('null input', function() {
      expect(GokuChecker.isNull(null)).toBeTruthy();
    });

    it('undefined input', function() {
      expect(GokuChecker.isNull(undefined)).toBeTruthy();
    });

    it('empty object input', function() {
      expect(GokuChecker.isNull({})).not.toBeTruthy();
    });

    it('non-empty object input', function() {
      expect(GokuChecker.isNull({a: 123})).not.toBeTruthy();
    });

    it('empty array input', function() {
      expect(GokuChecker.isNull([])).not.toBeTruthy();
    });

    it('non-empty array input', function() {
      expect(GokuChecker.isNull([1,2,3])).not.toBeTruthy();
    });

    it('number input', function() {
      expect(GokuChecker.isNull(12)).not.toBeTruthy();
    });

    it('string input', function() {
      expect(GokuChecker.isNull(12)).not.toBeTruthy();
    });

  });

  describe('GokuChecker - isFiniteNumber', function() {

    it('null input', function() {
      expect(GokuChecker.isFiniteNumber(null)).not.toBeTruthy();
    });

    it('undefined input', function() {
      expect(GokuChecker.isFiniteNumber(undefined)).not.toBeTruthy();
    });

    it('empty object input', function() {
      expect(GokuChecker.isFiniteNumber({})).not.toBeTruthy();
    });

    it('non-empty object input', function() {
      expect(GokuChecker.isFiniteNumber({a: 123})).not.toBeTruthy();
    });

    it('string input - positive', function() {
      expect(GokuChecker.isFiniteNumber('123')).toBeTruthy();
    });

    it('string input - negative', function() {
      expect(GokuChecker.isFiniteNumber('-123')).toBeTruthy();
    });

    it('string input - with wrong letter', function() {
      expect(GokuChecker.isFiniteNumber('15%23')).not.toBeTruthy();
    });

    it('string input - superbig', function() {
      expect(GokuChecker.isFiniteNumber('1512381231823129387')).toBeTruthy();
    });

    it('boolean input', function() {
      expect(GokuChecker.isFiniteNumber(true)).not.toBeTruthy();
    });

    it('number input - positive', function() {
      expect(GokuChecker.isFiniteNumber(123129381237)).toBeTruthy();
    });

    it('number input - negative', function() {
      expect(GokuChecker.isFiniteNumber(-123129381237)).toBeTruthy();
    });

  });

  describe('GokuChecker - isNumeric', function() {

    it('null input', function() {
      expect(GokuChecker.isNumeric(null)).not.toBeTruthy();
    });

    it('undefined input', function() {
      expect(GokuChecker.isNumeric(undefined)).not.toBeTruthy();
    });

    it('empty object input', function() {
      expect(GokuChecker.isNumeric({})).not.toBeTruthy();
    });

    it('non-empty object input', function() {
      expect(GokuChecker.isNumeric({a: 123})).not.toBeTruthy();
    });

    it('string input - positive', function() {
      expect(GokuChecker.isNumeric('123')).toBeTruthy();
    });

    it('string input - negative', function() {
      expect(GokuChecker.isNumeric('-123')).toBeTruthy();
    });

    it('string input - positive float', function() {
      expect(GokuChecker.isNumeric('123.12312')).toBeTruthy();
    });

    it('string input - negative float', function() {
      expect(GokuChecker.isNumeric('-123.12321')).toBeTruthy();
    });

    it('string input - with wrong letter', function() {
      expect(GokuChecker.isNumeric('15%23')).not.toBeTruthy();
    });

    it('string input - superbig', function() {
      expect(GokuChecker.isNumeric('1512381231823129387')).toBeTruthy();
    });

    it('boolean input', function() {
      expect(GokuChecker.isNumeric(true)).not.toBeTruthy();
    });

    it('number input - positive', function() {
      expect(GokuChecker.isNumeric(123129381237)).toBeTruthy();
    });

    it('number input - negative', function() {
      expect(GokuChecker.isNumeric(-123129381237)).toBeTruthy();
    });

    it('number input - positive float', function() {
      expect(GokuChecker.isNumeric(123129381237.12312)).toBeTruthy();
    });

    it('number input - negative float', function() {
      expect(GokuChecker.isNumeric(-123129381237.23232)).toBeTruthy();
    });

  });

  describe('GokuChecker - isPositiveFloat', function() {

    it('null input', function() {
      expect(GokuChecker.isPositiveFloat(null)).not.toBeTruthy();
    });

    it('undefined input', function() {
      expect(GokuChecker.isPositiveFloat(undefined)).not.toBeTruthy();
    });

    it('empty object input', function() {
      expect(GokuChecker.isPositiveFloat({})).not.toBeTruthy();
    });

    it('non-empty object input', function() {
      expect(GokuChecker.isPositiveFloat({a: 123})).not.toBeTruthy();
    });

    it('string input - positive', function() {
      expect(GokuChecker.isPositiveFloat('123')).not.toBeTruthy();
    });

    it('string input - negative', function() {
      expect(GokuChecker.isPositiveFloat('-123')).not.toBeTruthy();
    });

    it('string input - positive', function() {
      expect(GokuChecker.isPositiveFloat('123.123')).not.toBeTruthy();
    });

    it('string input - negative', function() {
      expect(GokuChecker.isPositiveFloat('-123.123')).not.toBeTruthy();
    });

    it('string input - with wrong letter', function() {
      expect(GokuChecker.isPositiveFloat('15%23')).not.toBeTruthy();
    });

    it('string input - superbig', function() {
      expect(GokuChecker.isPositiveFloat('1512381231823129387')).
      not.toBeTruthy();
    });

    it('boolean input', function() {
      expect(GokuChecker.isPositiveFloat(true)).not.toBeTruthy();
    });

    it('number input - positive', function() {
      expect(GokuChecker.isPositiveFloat(123129381237)).toBeTruthy();
    });

    it('number input - positive', function() {
      expect(GokuChecker.isPositiveFloat(0)).toBeTruthy();
    });

    it('number input - negative', function() {
      expect(GokuChecker.isPositiveFloat(-123129381237)).not.toBeTruthy();
    });

    it('number input - positive float', function() {
      expect(GokuChecker.isPositiveFloat(123129381237.12312)).toBeTruthy();
    });

    it('number input - negative float', function() {
      expect(GokuChecker.isPositiveFloat(-123129381237.23232)).not.toBeTruthy();
    });

  });

  describe('GokuChecker - isSet', function() {

    it('undefined input', function() {
      expect(GokuChecker.isSet(undefined)).not.toBeTruthy();
    });

    it('null input', function() {
      expect(GokuChecker.isSet(null)).toBeTruthy();
    });

    it('number input', function() {
      expect(GokuChecker.isSet(100)).toBeTruthy();
    });

    it('string input', function() {
      expect(GokuChecker.isSet('test string')).toBeTruthy();
    });

    it('object input', function() {
      expect(GokuChecker.isSet({a: 0,b: 2})).toBeTruthy();
    });

    it('array input', function() {
      expect(GokuChecker.isSet([1,2,3])).toBeTruthy();
    });

    it('boolean input - true', function() {
      expect(GokuChecker.isSet(true)).toBeTruthy();
    });

    it('boolean input - false', function() {
      expect(GokuChecker.isSet(false)).toBeTruthy();
    });

  });

  describe('GokuChecker - isSetNonNull', function() {

    it('undefined input', function() {
      expect(GokuChecker.isSetNonNull(undefined)).not.toBeTruthy();
    });

    it('null input', function() {
      expect(GokuChecker.isSetNonNull(null)).not.toBeTruthy();
    });

    it('number input', function() {
      expect(GokuChecker.isSetNonNull(100)).toBeTruthy();
    });

    it('string input', function() {
      expect(GokuChecker.isSetNonNull('test string')).toBeTruthy();
    });

    it('object input', function() {
      expect(GokuChecker.isSetNonNull({a: 0,b: 2})).toBeTruthy();
    });

    it('array input', function() {
      expect(GokuChecker.isSetNonNull([1,2,3])).toBeTruthy();
    });

    it('boolean input - true', function() {
      expect(GokuChecker.isSetNonNull(true)).toBeTruthy();
    });

    it('boolean input - false', function() {
      expect(GokuChecker.isSetNonNull(false)).toBeTruthy();
    });
  });

  describe('GokuChecker - isFunction', function() {

    it('null input', function() {
      expect(GokuChecker.isFunction(null)).not.toBeTruthy();
    });

    it('undefined input', function() {
      expect(GokuChecker.isFunction(undefined)).not.toBeTruthy();
    });

    it('empty object input', function() {
      expect(GokuChecker.isFunction({})).not.toBeTruthy();
    });

    it('non-empty object input', function() {
      expect(GokuChecker.isFunction({a: 123})).not.toBeTruthy();
    });

    it('string input', function() {
      expect(GokuChecker.isFunction('12312asdasd')).not.toBeTruthy();
    });

    it('boolean input', function() {
      expect(GokuChecker.isFunction(true)).not.toBeTruthy();
    });

    it('array input', function() {
      expect(GokuChecker.isFunction([1, 2, 3])).not.toBeTruthy();
    });

    it('anonymous function input - positive', function() {
      expect(GokuChecker.isFunction(function() {return false;})).toBeTruthy();
    });

    it('function var input - positive', function() {
      var a = function() {
        return false;
      };
      expect(GokuChecker.isFunction(a)).toBeTruthy();
    });

    it('member function input - positive', function() {
      var a = {};
      a.func = function() {
        return false;
      };
      expect(GokuChecker.isFunction(a.func)).toBeTruthy();
    });

    it('define function input - positive', function() {
      function a() {
        return false;
      };
      expect(GokuChecker.isFunction(a)).toBeTruthy();
    });

  });

  describe('GokuChecker - isArray', function() {

    it('null input', function() {
      expect(GokuChecker.isArray(null)).not.toBeTruthy();
    });

    it('undefined input', function() {
      expect(GokuChecker.isArray(undefined)).not.toBeTruthy();
    });

    it('empty object input', function() {
      expect(GokuChecker.isArray({})).not.toBeTruthy();
    });

    it('non-empty object input', function() {
      expect(GokuChecker.isArray({a: 123})).not.toBeTruthy();
    });

    it('string input', function() {
      expect(GokuChecker.isArray('12312asdasd')).not.toBeTruthy();
    });

    it('boolean input', function() {
      expect(GokuChecker.isArray(true)).not.toBeTruthy();
    });

    it('anonymous function input - positive', function() {
      expect(GokuChecker.isArray(function() {return false;})).not.toBeTruthy();
    });

    it('function var input - positive', function() {
      var a = function() {
        return false;
      };
      expect(GokuChecker.isArray(a)).not.toBeTruthy();
    });

    it('member function input - positive', function() {
      var a = {};
      a.func = function() {
        return false;
      };
      expect(GokuChecker.isArray(a.func)).not.toBeTruthy();
    });

    it('define function input - positive', function() {
      function a() {
        return false;
      };
      expect(GokuChecker.isArray(a)).not.toBeTruthy();
    });

    it('number array input ', function() {
      expect(GokuChecker.isArray([1, 2, 3, 4])).toBeTruthy();
    });

    it('string array input ', function() {
      expect(GokuChecker.isArray(['1', '1232', '23', 'asd'])).toBeTruthy();
    });

    it('obj array input ', function() {
      expect(GokuChecker.isArray([{a: 1}, {b: 2}, {c: 2}])).toBeTruthy();
    });

    it('mixed array input ', function() {
      expect(GokuChecker.isArray([233, '2323', {c: 2}])).toBeTruthy();
    });

  });

  describe('GokuChecker - isInArray', function() {

    it('in array number - true', function() {
      expect(GokuChecker.isInArray(1, [1, 2, 3])).toBeTruthy();
    });

    it('in array string - true', function() {
      expect(GokuChecker.isInArray('test', ['test1', 'test2', 'test'])).
        toBeTruthy();
    });

    it('in array mixed - true', function() {
      expect(GokuChecker.isInArray('test', ['test', 123, {a: 1}])).
        toBeTruthy();
    });

    it('in array bool - true', function() {
      expect(GokuChecker.isInArray(false, [true, true, false])).toBeTruthy();
    });

    it('in array obj - false', function() {
      expect(GokuChecker.isInArray({a: 1}, [{}, {a: 1}, {b: 2}])).
        not.toBeTruthy();
    });

  });

  describe('GokuChecker - isInt', function() {

    it('null input', function() {
      expect(GokuChecker.isInt(null)).not.toBeTruthy();
    });

    it('undefined input', function() {
      expect(GokuChecker.isInt(undefined)).not.toBeTruthy();
    });

    it('empty object input', function() {
      expect(GokuChecker.isInt({})).not.toBeTruthy();
    });

    it('non-empty object input', function() {
      expect(GokuChecker.isInt({a: 123})).not.toBeTruthy();
    });

    it('string input - positive', function() {
      expect(GokuChecker.isInt('123')).not.toBeTruthy();
    });

    it('string input - negative', function() {
      expect(GokuChecker.isInt('-123')).not.toBeTruthy();
    });

    it('string input - positive float', function() {
      expect(GokuChecker.isInt('123.232')).not.toBeTruthy();
    });

    it('string input - negative floar', function() {
      expect(GokuChecker.isInt('-123.123123')).not.toBeTruthy();
    });

    it('string input - with wrong letter', function() {
      expect(GokuChecker.isInt('15%23')).not.toBeTruthy();
    });

    it('string input - superbig', function() {
      expect(GokuChecker.isInt('1512381231823129387')).not.toBeTruthy();
    });

    it('boolean input', function() {
      expect(GokuChecker.isInt(true)).not.toBeTruthy();
    });

    it('number input - positive', function() {
      expect(GokuChecker.isInt(123129381237)).toBeTruthy();
    });

    it('number input - negative', function() {
      expect(GokuChecker.isInt(-123129381237)).toBeTruthy();
    });

    it('number input - positive float', function() {
      expect(GokuChecker.isInt(123129381237.123)).not.toBeTruthy();
    });

    it('number input - negative float', function() {
      expect(GokuChecker.isInt(-123129381237.4545)).not.toBeTruthy();
    });

  });

  describe('GokuChecker - isPositiveInt', function() {

    it('null input', function() {
      expect(GokuChecker.isPositiveInt(null)).not.toBeTruthy();
    });

    it('undefined input', function() {
      expect(GokuChecker.isPositiveInt(undefined)).not.toBeTruthy();
    });

    it('empty object input', function() {
      expect(GokuChecker.isPositiveInt({})).not.toBeTruthy();
    });

    it('non-empty object input', function() {
      expect(GokuChecker.isPositiveInt({a: 123})).not.toBeTruthy();
    });

    it('string input - positive', function() {
      expect(GokuChecker.isPositiveInt('123')).not.toBeTruthy();
    });

    it('string input - negative', function() {
      expect(GokuChecker.isPositiveInt('-123')).not.toBeTruthy();
    });

    it('string input - positive float', function() {
      expect(GokuChecker.isPositiveInt('123.232')).not.toBeTruthy();
    });

    it('string input - negative floar', function() {
      expect(GokuChecker.isPositiveInt('-123.123123')).not.toBeTruthy();
    });

    it('string input - with wrong letter', function() {
      expect(GokuChecker.isPositiveInt('15%23')).not.toBeTruthy();
    });

    it('string input - superbig', function() {
      expect(GokuChecker.isPositiveInt('1512381231823129387')).not.toBeTruthy();
    });

    it('boolean input', function() {
      expect(GokuChecker.isPositiveInt(true)).not.toBeTruthy();
    });

    it('number input - positive', function() {
      expect(GokuChecker.isPositiveInt(123129381237)).toBeTruthy();
    });

    it('number input - positive', function() {
      expect(GokuChecker.isPositiveInt(0)).toBeTruthy();
    });

    it('number input - negative', function() {
      expect(GokuChecker.isPositiveInt(-123129381237)).not.toBeTruthy();
    });

    it('number input - positive float', function() {
      expect(GokuChecker.isPositiveInt(123129381237.123)).not.toBeTruthy();
    });

    it('number input - negative float', function() {
      expect(GokuChecker.isPositiveInt(-123129381237.4545)).not.toBeTruthy();
    });

  });

  describe('GokuChecker - isNonEmptyStr', function() {

    it('string input - positive', function() {
      expect(GokuChecker.isNonEmptyStr('test')).toBeTruthy();
    });

    it('string input - positive', function() {
      expect(GokuChecker.isNonEmptyStr('123')).toBeTruthy();
    });

    it('string input - positive', function() {
      expect(GokuChecker.isNonEmptyStr('  ')).not.toBeTruthy();
    });

    it('string input - positive', function() {
      expect(GokuChecker.isNonEmptyStr('')).not.toBeTruthy();
    });

    it('null input', function() {
      expect(GokuChecker.isNonEmptyStr(null)).not.toBeTruthy();
    });

    it('undefined input', function() {
      expect(GokuChecker.isNonEmptyStr(undefined)).not.toBeTruthy();
    });

    it('empty object input', function() {
      expect(GokuChecker.isNonEmptyStr({})).not.toBeTruthy();
    });

    it('non-empty object input', function() {
      expect(GokuChecker.isNonEmptyStr({a: 123})).not.toBeTruthy();
    });

    it('boolean input', function() {
      expect(GokuChecker.isNonEmptyStr(true)).not.toBeTruthy();
    });

    it('number input - positive', function() {
      expect(GokuChecker.isNonEmptyStr(123129381237)).not.toBeTruthy();
    });

    it('number input - negative', function() {
      expect(GokuChecker.isNonEmptyStr(-123129381237)).not.toBeTruthy();
    });

    it('number input - positive float', function() {
      expect(GokuChecker.isPositiveInt(123129381237.123)).not.toBeTruthy();
    });

    it('number input - negative float', function() {
      expect(GokuChecker.isPositiveInt(-123129381237.4545)).not.toBeTruthy();
    });

  });

  describe('GokuChecker - isStr', function() {

    it('string input - positive', function() {
      expect(GokuChecker.isStr('test')).toBeTruthy();
    });

    it('string input - positive', function() {
      expect(GokuChecker.isStr('123')).toBeTruthy();
    });

    it('string input - positive', function() {
      expect(GokuChecker.isStr('  ')).toBeTruthy();
    });

    it('string input - positive', function() {
      expect(GokuChecker.isStr('')).toBeTruthy();
    });

    it('null input', function() {
      expect(GokuChecker.isStr(null)).not.toBeTruthy();
    });

    it('undefined input', function() {
      expect(GokuChecker.isStr(undefined)).not.toBeTruthy();
    });

    it('empty object input', function() {
      expect(GokuChecker.isStr({})).not.toBeTruthy();
    });

    it('non-empty object input', function() {
      expect(GokuChecker.isStr({a: 123})).not.toBeTruthy();
    });

    it('boolean input', function() {
      expect(GokuChecker.isStr(true)).not.toBeTruthy();
    });

    it('number input - positive', function() {
      expect(GokuChecker.isStr(123129381237)).not.toBeTruthy();
    });

    it('number input - negative', function() {
      expect(GokuChecker.isStr(-123129381237)).not.toBeTruthy();
    });

    it('number input - positive float', function() {
      expect(GokuChecker.isStr(123129381237.123)).not.toBeTruthy();
    });

    it('number input - negative float', function() {
      expect(GokuChecker.isStr(-123129381237.4545)).not.toBeTruthy();
    });

  });

  describe('GokuChecker - isStrInLength', function() {

    it('string input - positive', function() {
      expect(GokuChecker.isStrInLength('test', 10)).toBeTruthy();
    });

    it('string input - positive', function() {
      expect(GokuChecker.isStrInLength('123', 10)).toBeTruthy();
    });

    it('string input - positive', function() {
      expect(GokuChecker.isStrInLength('  ', 10)).toBeTruthy();
    });

    it('string input - positive', function() {
      expect(GokuChecker.isStrInLength('', 10)).toBeTruthy();
    });

    it('float length', function() {
      expect(GokuChecker.isStrInLength('tewtete', 10.2)).toBeTruthy();
    });

    it('exceed length', function() {
      expect(GokuChecker.isStrInLength('tewtete', 1)).not.toBeTruthy();
    });

    it('no length', function() {
      expect(GokuChecker.isStrInLength('tewtete')).not.toBeTruthy();
    });

    it('null length', function() {
      expect(GokuChecker.isStrInLength('tewtete', null)).not.toBeTruthy();
    });

    it('negative length', function() {
      expect(GokuChecker.isStrInLength('tewtete', -10)).not.toBeTruthy();
    });

    it('negative float length', function() {
      expect(GokuChecker.isStrInLength('tewtete', -10.5)).not.toBeTruthy();
    });

    it('null input', function() {
      expect(GokuChecker.isStrInLength(null, 10)).not.toBeTruthy();
    });

    it('undefined input', function() {
      expect(GokuChecker.isStrInLength(undefined, 10)).not.toBeTruthy();
    });

    it('empty object input', function() {
      expect(GokuChecker.isStrInLength({})).not.toBeTruthy();
    });

    it('non-empty object input', function() {
      expect(GokuChecker.isStrInLength({a: 123}, 10)).not.toBeTruthy();
    });

    it('boolean input', function() {
      expect(GokuChecker.isStrInLength(true, 10)).not.toBeTruthy();
    });

    it('number input - positive', function() {
      expect(GokuChecker.isStrInLength(123129381237, 10)).not.toBeTruthy();
    });

    it('number input - negative', function() {
      expect(GokuChecker.isStrInLength(-123129381237, 10)).not.toBeTruthy();
    });

    it('number input - positive float', function() {
      expect(GokuChecker.isStrInLength(123129381237.123, 10)).not.toBeTruthy();
    });

    it('number input - negative float', function() {
      expect(GokuChecker.isStrInLength(-123129381237.4545, 10)).
        not.toBeTruthy();
    });

  });

  describe('GokuChecker - isInRange', function() {

    it('null input', function() {
      expect(GokuChecker.isInRange(null, 0, 10)).not.toBeTruthy();
    });

    it('undefined input', function() {
      expect(GokuChecker.isInRange(undefined, 0, 10)).not.toBeTruthy();
    });

    it('empty object input', function() {
      expect(GokuChecker.isInRange({}, 0, 10)).not.toBeTruthy();
    });

    it('non-empty object input', function() {
      expect(GokuChecker.isInRange({a: 123}, 0, 10)).
        not.toBeTruthy();
    });

    it('string input - positive', function() {
      expect(GokuChecker.isInRange('5', 0, 10)).toBeTruthy();
    });

    it('string input - negative', function() {
      expect(GokuChecker.isInRange('-2', -10, 10)).toBeTruthy();
    });

    it('string input - positive float', function() {
      expect(GokuChecker.isInRange('1.232', 0, 10)).toBeTruthy();
    });

    it('string input - negative floar', function() {
      expect(GokuChecker.isInRange('-1.123123', -10, 10)).toBeTruthy();
    });

    it('string input - with wrong letter', function() {
      expect(GokuChecker.isInRange('15%23', 0, 10)).not.toBeTruthy();
    });

    it('boolean input', function() {
      expect(GokuChecker.isInRange(true, 0, 10)).not.toBeTruthy();
    });

    it('number input - positive', function() {
      expect(GokuChecker.isInRange(20, 0, 100)).toBeTruthy();
    });

    it('number input - positive not in range', function() {
      expect(GokuChecker.isInRange(-20, 0, 100)).not.toBeTruthy();
    });

    it('number input - reversed range', function() {
      expect(GokuChecker.isInRange(20, 100, 0)).toBeTruthy();
    });

    it('number input - negative', function() {
      expect(GokuChecker.isInRange(-10, -100, 100)).toBeTruthy();
    });

    it('number input - positive float', function() {
      expect(GokuChecker.isInRange(5.123, 0, 10)).toBeTruthy();
    });

    it('number input - positive float not in range', function() {
      expect(GokuChecker.isInRange(15.123, 0, 10)).not.toBeTruthy();
    });

    it('number input - negative float', function() {
      expect(GokuChecker.isInRange(-5.123, -10, 10)).toBeTruthy();
    });

  });

  describe('GokuChecker - isEmptyObj', function() {

    it('empty', function() {
      expect(GokuChecker.isEmptyObj({})).toBeTruthy();
    });

    it('non empty', function() {
      expect(GokuChecker.isEmptyObj({a: 1})).not.toBeTruthy();
    });

    it('string', function() {
      expect(GokuChecker.isEmptyObj('123')).not.toBeTruthy();
    });

    it('empty array', function() {
      expect(GokuChecker.isEmptyObj([])).not.toBeTruthy();
    });

    it('array', function() {
      expect(GokuChecker.isEmptyObj([1, 2, 3])).not.toBeTruthy();
    });

    it('null', function() {
      expect(GokuChecker.isEmptyObj(null)).not.toBeTruthy();
    });
  });

  describe('GokuChecker - isEqual', function() {

    it('empty', function() {
      expect(GokuChecker.isEqual({}, {})).toBeTruthy();
      expect(GokuChecker.isEqual(null, null)).toBeTruthy();
    });

    it('general', function() {
      expect(GokuChecker.isEqual({a: 1}, {a: 1})).toBeTruthy();
      expect(GokuChecker.isEqual({a: 1}, {b: 1})).not.toBeTruthy();
    });

    it('string', function() {
      expect(GokuChecker.isEqual('asd', 'asd')).toBeTruthy();
      expect(GokuChecker.isEqual('asd', 'asd2')).not.toBeTruthy();
    });

    it('number', function() {
      expect(GokuChecker.isEqual(1, 1)).toBeTruthy();
      expect(GokuChecker.isEqual(1, 2)).not.toBeTruthy();
    });

    it('complex', function() {
      var a = {
        a: 1,
        b: 'text',
        c: null,
        d: {
          d1: 1,
          d2: 'text',
          d3: null
        }
      }
      var b = {
        a: 1,
        b: 'text',
        c: null,
        d: {
          d1: 1,
          d2: 'text',
          d3: null
        }
      }
      var c = {
        a: 1,
        b: 'text',
        c: null,
        d: {
          d1: 1,
          d2: 'text',
          d3: 123
        }
      }
      expect(GokuChecker.isEqual(a, b)).toBeTruthy();
      expect(GokuChecker.isEqual(a, c)).not.toBeTruthy();
    });


  });

});
