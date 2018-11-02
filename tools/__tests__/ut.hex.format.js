"use strict";

jest.autoMockOff();

var GokuFormat = require('../hex.format');

describe('GokuFormat', function() {

  describe('GokuFormat - toPlainString', function() {

    it('null input', function() {
      expect(GokuFormat.toPlainString(null)).toEqual('null');
    });

    it('undefined input', function() {
      expect(GokuFormat.toPlainString(undefined)).toEqual('undefined');
    });

    it('number input', function() {
      expect(GokuFormat.toPlainString(123)).toEqual('123');
    });

    it('string input', function() {
      expect(GokuFormat.toPlainString('test string')).toEqual('test string');
    });

    it('boolean input - true', function() {
      expect(GokuFormat.toPlainString(true)).toEqual('true');
    });

    it('boolean input - false', function() {
      expect(GokuFormat.toPlainString(false)).toEqual('false');
    });

    it('array input - number', function() {
      expect(GokuFormat.toPlainString([1,2,3,4])).toEqual('[1,2,3,4]');
    });

    it('array input - string', function() {
      expect(GokuFormat.toPlainString(['test1','test2','test2','test4'])).
        toEqual('["test1","test2","test2","test4"]');
    });

    it('object input', function() {
      expect(GokuFormat.toPlainString({a: 1,b: 2,c: 3,d: '123'})).
        toEqual('{"a":1,"b":2,"c":3,"d":"123"}');
    });

  });

  describe('GokuFormat - joinStrings', function() {

    it('array input - string', function() {
      expect(GokuFormat.joinStrings(['a','b','c'], ',')).toEqual('a,b,c');
    });

    it('array input - number', function() {
      expect(GokuFormat.joinStrings([1, 2, 3], ',')).toEqual('1,2,3');
    });

    it('array input - mixed', function() {
      expect(GokuFormat.joinStrings([1, 2, '3'], ',')).toEqual('1,2,3');
    });

    it('array input - no seperator', function() {
      expect(GokuFormat.joinStrings([1, 2, 3])).toEqual('1 2 3');
    });

    it('string input - no seperator', function() {
      expect(GokuFormat.joinStrings('test string')).toEqual('test string');
    });

  });

  describe('GokuFormat - formatDate', function() {

    it('no format', function() {
      var date = new Date(2015, 0, 2, 20, 10, 2);
      expect(GokuFormat.formatDate(date, '')).toEqual('');
    });

    it('no date', function() {
      var date;
      expect(GokuFormat.formatDate(date, 'yyyy-MM-dd HH:mm:ss')).toEqual('');
    });

    it('not date', function() {
      var date = {a: 1};
      expect(GokuFormat.formatDate(date, 'yyyy-MM-dd HH:mm:ss')).toEqual('');
    });

    it('General 24H', function() {
      var date = new Date(2015, 0, 2, 20, 10, 2);
      expect(GokuFormat.formatDate(date, 'yyyy-MM-dd HH:mm:ss')).
        toEqual('2015-01-02 20:10:02');
    });

  });

  describe('GokuFormat - formatTimeSpan', function() {

    it('no diff', function() {
      var diff;
      expect(GokuFormat.formatTimeSpan(diff, 'dd hh mm ss')).toEqual('');
    });

    it('string diff', function() {
      var diff = 'AAA';
      expect(GokuFormat.formatTimeSpan(diff, 'dd hh mm ss')).toEqual('');
    });

    it('object diff', function() {
      var diff = new Date();
      expect(GokuFormat.formatTimeSpan(diff, 'dd hh mm ss')).toEqual('');
    });

    it('no format', function() {
      var date1 = new Date(2015, 0, 1, 0, 0);
      var date2 = new Date(2015, 0, 10, 10, 10);
      var diff = date2 - date1;
      expect(GokuFormat.formatTimeSpan(diff, '')).toEqual('');
    });

    it('general', function() {
      var date1 = new Date(2015, 0, 1, 0, 0);
      var date2 = new Date(2015, 0, 10, 10, 10);
      var diff = date2 - date1;
      expect(GokuFormat.formatTimeSpan(diff, 'dd hh mm ss')).
        toEqual('9 10 10 0');
    });

    it('negative', function() {
      var date1 = new Date(2015, 0, 1, 0, 0);
      var date2 = new Date(2015, 0, 10, 10, 10);
      var diff = date1 - date2;
      expect(GokuFormat.formatTimeSpan(diff, 'dd hh mm ss')).toEqual('0 0 0 0');
    });

    it('year', function() {
      var date1 = new Date(2014, 0, 1, 0, 0);
      var date2 = new Date(2015, 0, 10, 10, 10);
      var diff = date2 - date1;
      expect(GokuFormat.formatTimeSpan(diff, 'dd hh mm ss')).
        toEqual('374 10 10 0');
    });

  });

  describe('GokuFormat - getKeyByValue', function() {

    it('have value - number', function() {
      expect(GokuFormat.getKeyByValue(2, {a: 1,b: 2})).toEqual('b');
    });

    it('have value - string', function() {
      expect(GokuFormat.getKeyByValue('test', {a: 1,b: 2,c: 'test'})).
        toEqual('c');
    });

    it('have value - null', function() {
      expect(GokuFormat.getKeyByValue(null, {a: 1,b: null,c: 'test'})).
        toEqual('b');
    });

    it('not have value', function() {
      expect(GokuFormat.getKeyByValue(3, {a: 1,b: 2})).
        toEqual(null);
    });

  });

  describe('GokuFormat - toFixDigit', function() {

    it('general', function() {
      expect(GokuFormat.toFixDigit(2, 2)).toEqual('02');
    });

    it('long digit', function() {
      expect(GokuFormat.toFixDigit(2, 10)).toEqual('0000000002');
    });

    it('already fit', function() {
      expect(GokuFormat.toFixDigit(20, 2)).toEqual('20');
    });

    it('wrong digit length', function() {
      expect(GokuFormat.toFixDigit(20)).toEqual('20');
    });

    it('wrong num', function() {
      expect(GokuFormat.toFixDigit()).toEqual('');
    });

  });

  describe('GokuFormat - str', function() {
    var formatPtn = 'format {0} {1} {2}';
    var noFormatPtn = 'noFormat';

    it('general', function() {
      expect(GokuFormat.str(noFormatPtn)).toEqual(noFormatPtn);
      expect(GokuFormat.str(formatPtn)).toEqual('format   ');
      expect(GokuFormat.str(formatPtn, '0', '1')).toEqual('format 0 1 ');
      expect(GokuFormat.str(formatPtn, '0', '1', '2')).toEqual('format 0 1 2');
    });
  });

});
