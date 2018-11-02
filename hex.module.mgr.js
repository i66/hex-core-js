
const HexGeneralModule = require('./hex.general.module');
const HexModuleStatus = require('./types/hex.module.status');

const checker = require('./tools/hex.checker');

class HexModuleMgr extends HexGeneralModule {
  constructor() {
    super();
    this.moduleList = [];
    this.successModuleList = [];
    this.erroredModuleList = [];
    this.numInitModule = 0;

    this.successStartModuleList = [];
    this.erroredStartModuleList = [];
    this.numStartModule = 0;

    this.initCbOk = null;
    this.initCbFail = null;
    this.initCbFinal = null;

    this.startCbOk = null;
    this.startCbFail = null;
    this.startCbFinal = null;
  }

  /**
  * Register module to run
  *
  * @param {HexGeneralModule} Module to init
  */
  regModules() {
    var args = Array.prototype.slice.call(arguments);
    var curArg = null;
    for (var i = 0; i < args.length; i++) {
      curArg = args[i];
      if (curArg instanceof HexGeneralModule) {
        this._logSelfDebug('Register Module: {0}/{1}', curArg.type, curArg.id);
        this.moduleList.push(curArg);
      } else {
        this._logSelfDebug('Ignore Module: {0}/{1}', curArg.type, curArg.id);
      }
    }
  }

  /**
  * Start init all registered modules
  *
  * @param {function} cb(stat, msg, data) - Callback
  * - {HexModuleStatus} stat - Init State
  * - {string} msg
  * - {object} data - All module instance
  *  - {array} success - List of init success modules
  *  - {array} failed - List of init failed modules
  */
  init() {
    var args = Array.prototype.slice.call(arguments);
    this.regModules.apply(this, args);

    this._logSelfDebug('Start Batch Init');
    this.numInitModule = 0;
    this.successModuleList = [];
    this.erroredModuleList = [];

    var curModule = null;
    for (var i = 0; i < this.moduleList.length; i++) {
      curModule = this.moduleList[i];
      if (curModule.isAsync()) {
        curModule.getReady(null).finally(this._onModuleInitDone.bind(this));
      } else {
        var stat = HexModuleStatus.READY;
        if (curModule.getReady(null) != true) {
          stat = HexModuleStatus.INIT_ERROR;
        }
        this._onModuleInitDone(stat, '', curModule);
      }

    }
    return this;
  }

  success(cb) {
    if (this.numStartModule == 0) {
      this.initCbOk = cb;
    } else {
      this.startCbOk = cb;
    }
    return this;
  }

  failed(cb) {
    if (this.numStartModule == 0) {
      this.initCbFail = cb;
    } else {
      this.startCbFail = cb;
    }
    return this;
  }

  finally(cb) {
    if (this.numStartModule == 0) {
      this.initCbFinal = cb;
    } else {
      this.startCbFinal = cb;
    }
    return this;
  }



  /**
  * Start all modules
  *
  * @param {function} cb(stat, msg, data) - Callback
  * - {HexModuleStatus} stat - Init State
  * - {string} msg
  * - {object} data - All module instance
  *  - {array} success - List of init success modules
  *  - {array} failed - List of init failed modules
  */
  start(cbOk, cbFail) {
    this.numStartModule = 0;
    this.successStartModuleList = [];
    this.erroredStartModuleList = [];

    if (checker.isFunction(cbOk)) {
      this.startCbOk = cbOk;
    }

    if (checker.isFunction(cbFail)) {
      this.startCbFail = cbFail;
    }

    var curModule = null;
    for (var i = 0; i < this.moduleList.length; i++) {
      curModule = this.moduleList[i];
      curModule.start(this._onModuleStartDone.bind(this));
    }
    return this;
  }

  _onModuleInitDone(stat, msg, data) {
    this.numInitModule++;
    if (stat == HexModuleStatus.READY) {
      this.successModuleList.push(data);
    } else {
      this.erroredModuleList.push(data);
    }

    this._logSelfDebug('Module Init Done: {0}/{1}',
      this.numInitModule, this.moduleList.length);

    if (this.numInitModule >= this.moduleList.length) {
      this._logSelfDebug('Module Init All Done');
      var finalStatus = HexModuleStatus.READY;
      var finalCb = this.initCbOk;
      if (this.erroredModuleList.length > 0) {
        finalStatus = HexModuleStatus.INIT_ERROR;
        finalCb = this.initCbFail;
      }

      var finalData =
      {
        success: this.successModuleList,
        failed: this.erroredModuleList
      };

      this._checkAndCall(finalCb, finalStatus, '', finalData);
      this._checkAndCall(this.initCbFinal, finalStatus, '', finalData);
    }
  }

  _onModuleStartDone(stat, msg, data) {

    this.numStartModule++;
    if (stat == HexModuleStatus.STARTED) {
      this.successStartModuleList.push(data);
    } else {
      this.erroredStartModuleList.push(data);
    }

    this._logSelfDebug('Module Start Done: {0}/{1}',
      this.numStartModule, this.moduleList.length);

    if (this.numStartModule >= this.moduleList.length) {
      this._logSelfDebug('Module Start All Done');

      var finalStatus = HexModuleStatus.STARTED;
      var finalCb = this.startCbOk;
      if (this.erroredModuleList.length > 0) {
        finalStatus = HexModuleStatus.RUN_ERROR;
        finalCb = this.startCbFail;
      }

      var finalData =
      {
        success: this.successModuleList,
        failed: this.erroredModuleList
      };

      this._checkAndCall(finalCb, finalStatus, '', finalData);
      this._checkAndCall(this.startCbFinal, finalStatus, '', finalData);

    }
  }

}

module.exports = HexModuleMgr;
