'use strict';

jest.mock('../../../tools/hex.logger');
var HexUiDataHelper = require('../hex.ui.data.helper');

global.require = require;

describe('HexUiDataHelper', function() {

  beforeEach(function() {
  });

  afterEach(function() {
  });

  var keyId = 'ID';
  var keyTitle = 'TITLE';
  var keyData = 'DATA';

  var dataAry = [];
  var data1 = {};
  data1[keyId] = 'key_01';
  data1[keyTitle] = 'title_01';
  data1[keyData] = 'data_01';
  dataAry.push(data1);

  var data2 = {};
  data2[keyId] = 'key_02';
  data2[keyTitle] = 'title_02';
  data2[keyData] = 'data_02';
  dataAry.push(data2);

  var data3 = {};
  data3[keyId] = 'key_03';
  data3[keyTitle] = 'title_03';
  data3[keyData] = 'data_03';
  dataAry.push(data3);

  it('getItem - General', function() {
    var item = HexUiDataHelper.getItem(dataAry, keyId, keyTitle, keyData);
    expect(item.length).toEqual(dataAry.length);

    for (var i = 0; i < item.length; i++) {
      expect(item[i].key).toEqual(dataAry[i][keyId]);
      expect(item[i].title).toEqual(dataAry[i][keyTitle]);
      expect(item[i].data).toEqual(dataAry[i][keyData]);
    }
  });

  it('getItem - Selected', function() {
    var selectedId = data3[keyId];
    var item = HexUiDataHelper.getItem(
              dataAry, keyId, keyTitle, keyData, selectedId);
    expect(item.length).toEqual(dataAry.length);

    for (var i = 0; i < item.length; i++) {
      expect(item[i].key).toEqual(dataAry[i][keyId]);
      expect(item[i].title).toEqual(dataAry[i][keyTitle]);
      expect(item[i].data).toEqual(dataAry[i][keyData]);
    }
    expect(item[2].isSelected).toEqual(true);
  });

  it('getItem - PackData', function() {
    var selectedId = data3[keyId];
    var item = HexUiDataHelper.getItem(
              dataAry, keyId, keyTitle, keyData, selectedId, true);
    expect(item.length).toEqual(dataAry.length);

    for (var i = 0; i < item.length; i++) {
      expect(item[i].key).toEqual(dataAry[i][keyId]);
      expect(item[i].title).toEqual(dataAry[i][keyTitle]);
      expect(item[i].data).toEqual(dataAry[i]);
    }
    expect(item[2].isSelected).toEqual(true);
  });

});
