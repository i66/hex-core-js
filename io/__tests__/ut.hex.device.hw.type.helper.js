'use strict';

jest.mock('../../tools/hex.logger');

var HexDeviceItemCate = require('../../types/hex.device.item.cate');
var HexDeviceItemType = require('../../types/hex.device.item.type');
var checker = require('../../tools/hex.checker');

global.require = require;

describe('HexDeviceHwTypeHelper', function() {
  var HexDeviceHwTypeHelper = require('../hex.device.hw.type.helper');

  var deviceM1 = 0x00000001;
  var deviceM2 = 0x00000002;
  var deviceM3 = 0x00000004;
  var sensorHeat = 0x00000100;
  var sensorHumidity = 0x00000200;
  var sensorSmoke = 0x00000400;
  var sensorManual = 0x00000800;

  beforeEach(function() {

  });

  afterEach(function() {

  });

  it('isIndicator', function() {
    expect(HexDeviceHwTypeHelper.isIndicator()).toEqual(false);

    expect(HexDeviceHwTypeHelper.isIndicator(deviceM1)).toEqual(true);
    expect(HexDeviceHwTypeHelper.isIndicator(deviceM2)).toEqual(true);
    expect(HexDeviceHwTypeHelper.isIndicator(deviceM3)).toEqual(true);

    expect(HexDeviceHwTypeHelper.isIndicator(sensorHeat)).toEqual(false);
    expect(HexDeviceHwTypeHelper.isIndicator(sensorHumidity)).toEqual(false);
    expect(HexDeviceHwTypeHelper.isIndicator(sensorSmoke)).toEqual(false);
    expect(HexDeviceHwTypeHelper.isIndicator(sensorManual)).toEqual(false);
  });

  it('isSensor', function() {
    expect(HexDeviceHwTypeHelper.isSensor()).toEqual(false);

    expect(HexDeviceHwTypeHelper.isSensor(deviceM1)).toEqual(false);
    expect(HexDeviceHwTypeHelper.isSensor(deviceM2)).toEqual(false);
    expect(HexDeviceHwTypeHelper.isSensor(deviceM3)).toEqual(false);

    expect(HexDeviceHwTypeHelper.isSensor(sensorHeat)).toEqual(true);
    expect(HexDeviceHwTypeHelper.isSensor(sensorHumidity)).toEqual(true);
    expect(HexDeviceHwTypeHelper.isSensor(sensorSmoke)).toEqual(true);
    expect(HexDeviceHwTypeHelper.isSensor(sensorManual)).toEqual(true);
  });

  it('getItemType', function() {
    expect(HexDeviceHwTypeHelper.getItemType()).toEqual(null);
    expect(HexDeviceHwTypeHelper.getItemType(null, false)).toEqual(false);

    expect(HexDeviceHwTypeHelper.getItemType(deviceM1)).
      toEqual(HexDeviceItemType.INDICATOR_M1);
    expect(HexDeviceHwTypeHelper.getItemType(deviceM2)).
      toEqual(HexDeviceItemType.INDICATOR_M2);
    expect(HexDeviceHwTypeHelper.getItemType(deviceM3)).
      toEqual(HexDeviceItemType.INDICATOR_M3);

    expect(HexDeviceHwTypeHelper.getItemType(sensorHeat)).
      toEqual(HexDeviceItemType.SENSOR_HEAT);
    expect(HexDeviceHwTypeHelper.getItemType(sensorHumidity)).
      toEqual(HexDeviceItemType.SENSOR_HUMIDITY);
    expect(HexDeviceHwTypeHelper.getItemType(sensorSmoke)).
      toEqual(HexDeviceItemType.SENSOR_SMOKE);
    expect(HexDeviceHwTypeHelper.getItemType(sensorManual)).
      toEqual(HexDeviceItemType.SENSOR_MANUAL);
  });

  it('getItemCate', function() {
    expect(HexDeviceHwTypeHelper.getItemCate()).toEqual(null);
    expect(HexDeviceHwTypeHelper.getItemCate(null, false)).toEqual(false);

    expect(HexDeviceHwTypeHelper.getItemCate(deviceM1)).
      toEqual(HexDeviceItemCate.INDICATOR);
    expect(HexDeviceHwTypeHelper.getItemCate(deviceM2)).
      toEqual(HexDeviceItemCate.INDICATOR);
    expect(HexDeviceHwTypeHelper.getItemCate(deviceM3)).
      toEqual(HexDeviceItemCate.INDICATOR);

    expect(HexDeviceHwTypeHelper.getItemCate(sensorHeat)).
      toEqual(HexDeviceItemCate.SENSOR);
    expect(HexDeviceHwTypeHelper.getItemCate(sensorHumidity)).
      toEqual(HexDeviceItemCate.SENSOR);
    expect(HexDeviceHwTypeHelper.getItemCate(sensorSmoke)).
      toEqual(HexDeviceItemCate.SENSOR);
    expect(HexDeviceHwTypeHelper.getItemCate(sensorManual)).
      toEqual(HexDeviceItemCate.SENSOR);
  });

});
