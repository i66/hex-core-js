'use strict';

var HexPathMgr = require('./hex.path.mgr.factory').getInstance();
var HexFileMgr = require('./hex.file.mgr.factory').getInstance();

var logger = require('../tools/hex.logger');
var checker = require('../tools/hex.checker');
var util = require('../tools/hex.util');
var validator = require('../tools/hex.validator');
var format = require('../tools/hex.format');

const MODULE_ID = 'HexHeartBeatMgr';
const FILE_NAME = 'heart-beat.json';
const TPL_DATETIME = 'yyyy-MM-dd HH:mm:ss';

const DEFAULT_INTERVAL = 1000 * 60 * 5;
var _interval = DEFAULT_INTERVAL;
var _handler = null;

var HexHeartBeatMgr = {

  start: function(interval) {
    this.stop();
    if (checker.isInt(interval)) {
      _interval = interval;
    } else {
      _interval = DEFAULT_INTERVAL;
    }
    this._startHeartbeat();
  },

  stop: function() {
    this._stopHeartbeat();
  },

  _startHeartbeat: function() {
    logger.infoEmp('Start HEART BEAT - ' + _interval, MODULE_ID);
    _handler = setInterval(this._heartbeat.bind(this), _interval);
  },

  _stopHeartbeat: function() {
    if (_handler != null) {
      logger.infoEmp('Stop HEART BEAT - ' + _interval, MODULE_ID);
      clearInterval(_handler);
      _handler = null;
    }
  },

  _heartbeat: function() {
    var writePath = HexPathMgr.joinPath(HexPathMgr.getAppDataPath(), FILE_NAME);
    logger.infoEmp('>>> HEART BEAT >>> ' + writePath, MODULE_ID);
    try {
      var data = {};
      data.timeStamp = format.formatDate(new Date(), TPL_DATETIME);
      HexFileMgr.writeFileJson(writePath, data);
    } catch (e) {
      logger.error('>>> HEART BEAT ERROR >>> ' + e.toString(), MODULE_ID);
    }
  }

};

module.exports = HexHeartBeatMgr;
