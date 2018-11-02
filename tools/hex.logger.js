var HexLogType = require('../types/hex.log.type');
var HexLogLevel = require('../types/hex.log.level');
var format = require('./hex.format');
var checker = require('./hex.checker');
var util = require('./hex.util');

const MODULE_ID = 'HexLogger';
const MAX_LOG_IDX = 100;
const TPL_DATETIME = 'yyyy-MM-dd HH:mm:ss';
const DEFAULT_BROWSER_LOG_TYPE = 'info';

const LV_VERBOSE = 4;
const LV_DEBUG = 3;
const LV_NORMAL = 2;
const LV_HIGH = 1;
const LV_CORE = 0;

var browserLogTypeAry = ['info', 'warn', 'error'];
var _callbacks = [];
var _callbackId = 0;
var _logIdx = 0;
var _isLogConsole = true;
var _logLevel = LV_NORMAL;
var _prettyJsonLevel = 0;

var HexLogger = function() {};
HexLogger.prototype = Object.assign({}, HexLogger.prototype, {
  VERBOSE: HexLogLevel.VERBOSE,
  DEBUG: HexLogLevel.DEBUG,
  NORMAL: HexLogLevel.NORMAL,
  HIGH: HexLogLevel.HIGH,
  CORE: HexLogLevel.CORE,

  setLogLevel: function(logLevel) {
    var level = parseInt(logLevel);
    if (checker.isInCollection(level, HexLogLevel)) {
      _logLevel = level;
    } else {
      this.warn('invalid log level: ' + logLevel, MODULE_ID);
    }
  },

  setPrettyJsonLevel: function(prettyJsonLevel) {
    var level = parseInt(prettyJsonLevel);
    if (checker.isInRange(level, 0, 10)) {
      _prettyJsonLevel = level;
    } else {
      this.warn('invalid Pretty JSON level: ' + prettyJsonLevel, MODULE_ID);
    }
  },

  getLogLevel: function() {
    return _logLevel;
  },
  getPrettyJsonLevel: function() {
    return _prettyJsonLevel;
  },

  getLogLevelStr: function() {
    return HexLogLevel.getStr(_logLevel);
  },

  setLogConsole: function(isLogConsole) {
    _isLogConsole = isLogConsole;
  },
  log: function(message, tags, type, extra, level) {
    // Check log level
    if (level > _logLevel || extra > _logLevel) {
      return;
    }
    var now = format.formatDate(new Date(), TPL_DATETIME);
    if (!checker.isSetNonNull(type)) {
      type = HexLogType.LOG;
    }

    // Extra Info, swap
    if (checker.isSetNonNull(tags) &&
        (!checker.isStr(tags) || tags.indexOf('\"') != -1)) {
      // Data obj
      if (checker.isStr(tags)) {
        message += '\n' + tags;
      } else {
        message += '\n' + JSON.stringify(tags, undefined, _prettyJsonLevel);
      }
      tags = extra;
    }

    if (checker.isNull(tags)) {
      tags = [now];
    } else if (Array.isArray(tags)) {
      tags.unshift(now);
    } else {
      tags = [now, '[' + format.toPlainString(tags) + ']'];
    }
    //  tags.push('|');
    tags.push(message);

    var content = format.joinStrings(tags);
    if (_isLogConsole == true) {
      var browserConsoleType = this._ensureBrowserType(type);

      console[browserConsoleType](content);
    }

    var _this = this;
    var payload = [type, content, _logIdx];
    setTimeout(function() {
      _this.dispatch(payload);
    }, 0);

    _logIdx++;
    if (_logIdx > MAX_LOG_IDX) {
      _logIdx = 0;
    }
  },

  logInfo(type) {
    var msg = format.str.apply(null, arguments);
    logger.info(msg, type);
  },

  logDebug(type) {
    var msg = format.str.apply(null, arguments);
    logger.debug(msg, type);
  },

  error: function(message, tags, extra) {
    this.log(message, tags, HexLogType.ERROR, extra, this.CORE);
  },

  warn: function(message, tags, extra) {
    this.log(message, tags, HexLogType.WARN, extra, this.HIGH);
  },

  info: function(message, tags, extra, level) {
    if (!checker.isSetNonNull(level)) {
      level = this.NORMAL;
    }
    this.log(message, tags, HexLogType.INFO, extra, level);
  },

  debug: function(message, tags, extra, level) {
    if (!checker.isSetNonNull(level)) {
      level = this.DEBUG;
    }
    this.log(message, tags, HexLogType.INFO, extra, level);
  },

  infoBold: function(message, tags, extra, level) {
    this.log(message, tags, HexLogType.INFO_BOLD, extra, level);
  },

  infoCore: function(message, tags, extra) {
    this.log(message, tags, HexLogType.INFO, extra, this.CORE);
  },

  infoEmp: function(message, tags, extra) {
    this.log(message, tags, HexLogType.INFO_EMP, extra, this.HIGH);
  },

  infoInput: function(message, tags, extra) {
    this.log(message, tags, HexLogType.INFO_INPUT, extra, this.CORE);
  },

  infoMain: function(message, tags, extra) {
    this.log(message, tags, HexLogType.MAIN, extra, this.CORE);
  },

  console: function(message, tags, extra) {
    this.log(message, tags, HexLogType.CONSOLE, extra, this.CORE);
  },

  register: function(callback) {
    _callbackId++;
    var id = 'ID_' + _callbackId;
    _callbacks[id] = callback;
    return id;
  },

  unregister: function(id) {
    if (checker.isSet(_callbacks[id])) {
      delete _callbacks[id];
    } else {
      this.error('Callback is not registered: ' + id);
    }
  },

  unregisterAll: function() {
    _callbacks = [];
    _callbackId = 0;
  },
  dispatch: function(payload) {
    for (var id in _callbacks) {
      _callbacks[id](payload);
    }
  },
  _ensureBrowserType: function(type) {
    if (browserLogTypeAry.indexOf(type) == -1) {
      return DEFAULT_BROWSER_LOG_TYPE;
    }
    return type;
  }
});

module.exports = exports = new HexLogger();
