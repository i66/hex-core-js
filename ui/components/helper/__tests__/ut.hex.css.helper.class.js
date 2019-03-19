'use strict';

jest.mock('../../../tools/hex.logger');
var HexCssHelperClass = require('../hex.css.helper.class');

global.require = require;

describe('HexCssHelper', function() {

  var HexCssHelper;
  beforeEach(function() {
    HexCssHelper = new HexCssHelperClass();
  });

  afterEach(function() {
    HexCssHelper = null;
  });

  it('set', function() {
    var baseCss = 'baseCss';
    expect(HexCssHelper.set(baseCss).get()).toEqual(baseCss);
  });

  it('add', function() {
    var baseCss = 'baseCss';
    var add = 'add';
    var finalCss = baseCss + ' ' + add;
    expect(HexCssHelper.
      set(baseCss).add(add).get()).toEqual(finalCss);
  });

  it('addCheck', function() {
    var baseCss = 'baseCss';
    var add = 'add';
    var finalCss = baseCss + ' ' + add;

    expect(HexCssHelper.set(baseCss).
      addCheck(add, true).get()).toEqual(finalCss);
    expect(HexCssHelper.set(baseCss).
      addCheck(add, false).get()).toEqual(baseCss);
  });

});
