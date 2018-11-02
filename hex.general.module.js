const HexModuleStatus = require('./types/hex.module.status');
const HexPromiseMgr = require('./hex.promise.mgr');

const format = require('./tools/hex.format');
const checker = require('./tools/hex.checker');
const logger = require('./tools/hex.logger');

const CB_STAT_INIT = 0;
const CB_STAT_START = 1;
const CB_STAT_STOP = 2;
const CB_STAT_RESTART = 3;

class HexGeneralModule {
  constructor() {
    this._id = 'Module';
    this._type = this.constructor.name;
    this._extModuleRefMap = {};
    this._extModuleMap = {};
    this._config = null;
    this._isDebug = false;
    this._status = HexModuleStatus.CREATED;
    this._isService = false;
    this._isAutoStart = false;

    this._startCbOk = null;
    this._startCbFail = null;
    this._startCbFinal = null;

    this._stopCbOk = null;
    this._stopCbFail = null;
    this._stopCbFinal = null;

    this._restartCbOk = null;
    this._restartCbFail = null;
    this._restartCbFinal = null;

    this._initCbOk = null;
    this._initCbFail = null;
    this._initCbFinal = null;

    this._curCbStatus = null;

    this._isAsync = true;
    this._promiseMgr = new HexPromiseMgr(this);
    this._defineModule();
    this._defineExtModule();
  }

  get id() {
    return this._id;
  }

  get type() {
    return this._type;
  }

  setId(id) {
    this._id = id;
  }

  setConfig(config) {
    this._config = config;
  }

  setIsDebug(isDebug) {
    this._isDebug = isDebug;
  }

  isService() {
    return this._isService;
  }

  isAsync() {
    return this._isAsync;
  }

  _setIsService(isService) {
    this._isService = isService;
  }

  _setIsAsync(isAsync) {
    this._isAsync = isAsync;
  }

  _setCurCbStat(status) {
    this._curCbStatus = status;
  }

  getReady(config, cb) {
    if (checker.isSetNonNull(config)) {
      this.setConfig(config);
    }
    this._logSelfDebug('GetReady - {0}', this.isAsync() ? 'Async' : 'Sync');
    this._updateStatus(HexModuleStatus.PRE_INIT);
    this._preInit(config);
    this._updateStatus(HexModuleStatus.INIT);

    if (this.isAsync()) {
      this._setCurCbStat(CB_STAT_INIT);
      return this._getReadyAsync(config, cb);
    } else {
      return this._getReadySync(config);
    }

  }

  _ensureConfig(config) {
    if (checker.isSetNonNull(config)) {
      return config;
    }
    return this._config;
  }

  _getReadySync(config) {
    if (checker.isSetNonNull(config)) {
      this.setConfig(config);
    }

    var _this = this;
    var res = this._init(config);
    // sync
    if (res === true) {
      this._updateStatus(HexModuleStatus.INIT_OK);
      if (!this._isExtModuleReady()) {
        this._updateStatus(HexModuleStatus.EXT_MOD_ERROR);
        return false;
      }
      this._updateStatus(HexModuleStatus.POST_INIT);
      this._postInit(config);
      this._updateStatus(HexModuleStatus.READY);
      if (_this._isAutoStart) {
        return this.start();
      }
      return true;
    } else if (res === false) {
      this._updateStatus(HexModuleStatus.CONFIG_ERROR);
      return false;
    }
    return false;
  }

  _getReadyAsync(config, cb) {
    var _this = this;
    this._init(config, function(stat, msg, data) {
      if (stat == HexModuleStatus.INIT_OK) {
        if (!_this._isExtModuleReady()) {
          _this._updateStatus(HexModuleStatus.EXT_MOD_ERROR);
          _this._checkAndCall(_this._initCbOk, _this._status, msg, _this);
          _this._checkAndCall(
            _this._initCbFinal, _this._status, msg, _this);
        } else {
          _this._updateStatus(HexModuleStatus.POST_INIT);
          _this._postInit(config);
          _this._updateStatus(HexModuleStatus.READY);
          if (_this._isAutoStart) {
            _this.start(cb);
          } else {
            _this._checkAndCall(_this._initCbFail, _this._status, msg, _this);
            _this._checkAndCall(
              _this._initCbFinal, _this._status, msg, _this);
          }
        }
      } else {
        _this._checkAndCall(_this._workflowCbFail, _this._status, msg, _this);
        _this._checkAndCall(
          _this._workflowCbFinal, _this._status, msg, _this);
      }
    });

    return this;
  }

  success(cb) {
    switch (this._curCbStatus) {
      case CB_STAT_INIT:
        this._initCbOk = cb;
        break;
      case CB_STAT_START:
        this._startCbOk = cb;
        break;
      case CB_STAT_STOP:
        this._stopCbOk = cb;
        break;
      case CB_STAT_RESTART:
        this._restartCbOk = cb;
        break;
    }
    return this;
  }

  error(cb) {
    switch (this._curCbStatus) {
      case CB_STAT_INIT:
        this._initCbFail = cb;
        break;
      case CB_STAT_START:
        this._startCbFail = cb;
        break;
      case CB_STAT_STOP:
        this._stopCbFail = cb;
        break;
      case CB_STAT_RESTART:
        this._restartCbFail = cb;
        break;
    }
    return this;
  }

  finally(cb) {
    switch (this._curCbStatus) {
      case CB_STAT_INIT:
        this._initCbFinal = cb;
        break;
      case CB_STAT_START:
        this._startCbFinal = cb;
        break;
      case CB_STAT_STOP:
        this._stopCbFinal = cb;
        break;
      case CB_STAT_RESTART:
        this._restartCbFinal = cb;
        break;
    }
    return this;
  }

  _updateStatus(status) {
    this._status = status;
    this._logSelfDebug('{0} {1}', this._id, HexModuleStatus.getStr(status));
  }

  _defineModule() {

  }

  _defineExtModule() {

  }

  _preInit(config) {

  }

  _init(config, cb) {
    //this._needImplementWarn();
    this._resolveAsyncStatusInit(true, cb);
  }

  _postInit(config) {

  }

  setExtModule(instance) {
    var key = this._getExtModuleKey(instance);
    if (checker.isSetNonNull(key)) {
      var res = this._setExtModule(key, instance);
      if (res == true) {
        this._logSelfDebug(
          'Set Ext Module Success: {0}/{1}', instance.type, instance.id);
      } else {
        this._logWarn(
          'Set Ext Module Failed: {0}/{1}', instance.type, instance.id);
      }
    } else {
      this._logWarn('Set Unregistered module instance: {0}', instance);
    }
  }

  _getExtModuleKey(instance) {
    for (var key in this._extModuleRefMap) {
      if (instance instanceof this._extModuleRefMap[key]) {
        return key;
      }
    }
    return null;
  }

  _setExtModule(key, instance) {
    var baseClass = this._extModuleRefMap[key];
    if (checker.isSetNonNull(baseClass)) {
      if (instance instanceof baseClass) {
        this._extModuleMap[key] = instance;
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  _getExtModule(key) {
    var module = this._extModuleMap[key];
    if (checker.isSetNonNull(module)) {
      return module;
    } else {
      this._logWarn('Ext Module Not Found: {0}', key);
      return null;
    }
  }

  _regExtModule(key, baseClass) {
    this._extModuleRefMap[key] = baseClass;
  }

  _isExtModuleReady() {
    var isAllReady = true;
    for (var key in this._extModuleMap) {
      if (!checker.isSetNonNull(this._extModuleMap[key])) {
        isAllReady = false;
      }
    }
    return isAllReady;
  }


  /**
  * Start Module
  *
  * @param {function} cb(stat, msg, data) - Callback
  * - {PsKeyStatus} stat
  * - {string} msg
  * - {object} data - Generated API key
  *   - {string} apiKey
  *   - {string} secureKey
  */
  start(cb) {
    if (!this.isService()) {
      return this;
    }
    // Init First
    if (this._status == HexModuleStatus.CREATED) {
      this._isAutoStart = true;
      this.getReady(null);
      this._setCurCbStat(CB_STAT_START);
      return this;
    }

    if (this._status < HexModuleStatus.READY) {
      this._logWarn('Module is not ready, can not start.');
      return this;
    }
    this._updateStatus(HexModuleStatus.STARTING);
    if (this.isAsync()) {
      this._setCurCbStat(CB_STAT_START);
      var _this = this;
      var res = this._startDetail(cb);
      return this;
    } else {
      var res = this._startDetail();
      this._resolveStatusStart(res);
      return res;
    }
  }

  stop(cb) {
    if (!this.isService()) {
      return;
    }

    if (this._status < HexModuleStatus.STARTED) {
      this._logWarn('Module is not started, can not stop.');
      return;
    }
    this._updateStatus(HexModuleStatus.STOPPING);

    if (this.isAsync()) {
      this._setCurCbStat(CB_STAT_STOP);
      this._stopDetail(cb);
      return this;
    } else {
      var res = this._stopDetail();
      this._resolveSyncStatusStop(res);
      return res;
    }
  }

  restart(cb) {
    if (!this.isService()) {
      return;
    }

    this._logSelfDebug('Restart...');

    if (this.isAsync()) {
      var _this = this;
      this._setCurCbStat(CB_STAT_RESTART);
      this.stop(function(stat, msg, data) {
        if (stat == HexModuleStatus.STOPPED) {
          _this.start(function(stat, msg, data) {
            if (stat == HexModuleStatus.STARTED) {
              _this._resolveAsyncStatus(
                stat, [_this._restartCbOk, _this._restartCbFinal], msg);
            } else {
              _this._resolveAsyncStatus(
                stat, [_this._restartCbFail, _this._restartCbFinal], msg);
            }
          });
        } else {
          _this._resolveAsyncStatus(
            stat, [_this._restartCbFail, _this._restartCbFinal], msg);
        }
      });
      return this;
    } else {
      var res = this.stop();
      if (res === true) {
        return this.start();
      }
    }

  }

  _startDetail(cb) {
    this._needImplementWarn();
    this._resolveAsyncStatusStart(true, cb);
  }

  _stopDetail(cb) {
    this._needImplementWarn();
    this._resolveAsyncStatusStop(true, cb);
  }



  _resolveAsyncStatusInit(isSuccess, cb, msg) {
    this._resolveAsyncStatusCheck(
      HexModuleStatus.INIT_OK, HexModuleStatus.INIT_ERROR,
      cb, this._initCbOk, this._initCbFail, this._initCbFinal,
      isSuccess, msg);
  }

  _resolveAsyncStatusStart(isSuccess, cb, msg) {
    this._resolveAsyncStatusCheck(
      HexModuleStatus.STARTED, HexModuleStatus.RUN_ERROR,
      cb, this._startCbOk, this._startCbFail, this._startCbFinal,
      isSuccess, msg);
  }

  _resolveAsyncStatusStop(isSuccess, cb, msg) {
    this._resolveAsyncStatusCheck(
      HexModuleStatus.STOPPED, HexModuleStatus.STOP_ERROR,
      cb, this._stopCbOk, this._stopCbFail, this._stopCbFinal,
      isSuccess, msg);
  }

  _resolveSyncStatusStart(isSuccess) {
    this._resolveSyncStatusCheck(
      HexModuleStatus.STARTED, HexModuleStatus.RUN_ERROR
    );
  }

  _resolveSyncStatusStop(isSuccess) {
    this._resolveSyncStatusCheck(
      HexModuleStatus.STOPPED, HexModuleStatus.STOP_ERROR
    );
  }

  _resolveSyncStatusCheck(statOk, statFail, isSuccess) {
    var status = statOk;
    if (!isSuccess) {
      status = statFail;
    }
    this._updateStatus(status);
  }

  _newPromise() {
    return this._promiseMgr.newPromise();
  }

  _newResolvedPromise(isOk, stat, msg, data) {
    var promise = this._promiseMgr.newPromise();
    promise.resolve(isOk, stat, msg, data);
    return promise;
  }

  _resolveAsyncStatusCheck(
    statOk, statFail, cbChk, cbOk, cbFail, cbFinal, isSuccess, msg) {
    var stat = statOk;
    var cb = cbOk;
    if (!isSuccess) {
      stat = statFail;
      cb = cbFail;
    }
    this._resolveAsyncStatus(stat, [cbChk, cb, cbFinal], msg);
  }

  _resolveAsyncStatus(status, cbAry, msg) {
    this._updateStatus(status);
    for (var i = 0; i < cbAry.length; i++) {
      this._checkAndCall(cbAry[i], this._status, msg, this);
    }
  }


  _logInfo() {
    var msg = format.str.apply(null, arguments);
    logger.info(msg, this._type);
  }
  _logDebug() {
    var msg = format.str.apply(null, arguments);
    logger.debug(msg, this._type);
  }
  _logSelfDebug() {
    if (this._isDebug == true) {
      var msg = format.str.apply(null, arguments);
      logger.info(msg, this._type);
    }
  }
  _logError() {
    var msg = format.str.apply(null, arguments);
    logger.error(msg, this._type);
  }
  _logException(ex) {
    //var msg = format.str.apply(null, arguments);
    logger.error(ex.stack, this._type);
  }
  _logWarn() {
    var msg = format.str.apply(null, arguments);
    logger.warn(msg, this._type);
  }

  /**
  * Use for stub functions, throw exception when called in production
  */
  _needImplementWarn() {
    this._logWarn('Call to Stub Function "{0}"',
      this._getCallerFunctionName()
    );
  }

  /**
  * Use for stub functions, throw exception when called in production
  */
  _needImplementThrow() {
    throw format.str('Call to Stub Function "{0}"',
      this._getCallerFunctionName()
    );
  }

  _getCallerFunctionName() {
    var stack = new Error().stack;
    var caller = stack.split('\n')[3].trim().split(' ')[1];
    return caller;
  }

  _checkAndCall(cb, stat, msg, data) {
    if (checker.isFunction(cb)) {
      // Prevent from stack overflow
      setTimeout(function() {
        cb(stat, msg, data);
      }, 0);
    }
  }

  _checkAndCallDirect(cb, stat, msg, data) {
    if (checker.isFunction(cb)) {
      cb(stat, msg, data);
    }
  }
}

module.exports = HexGeneralModule;
