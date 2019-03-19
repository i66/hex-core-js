var logger = require('./tools/hex.logger');
var checker = require('./tools/hex.checker');
var HexPathMgr = require('./io/hex.path.mgr.factory').getInstance();

const MODULE_ID = 'HexAppLoader';

logger.useConsole = true;

var HexAppLoader = {
  _initAction: null,
  _waitStoreDict: {},
  _waitModuleCount: 0,
  _callback: null,
  _storeInitHandler: null,
  _storeReadyCount: 0,

  /**
 * Prepare for APP start
 *
 * @param initAction {Function} function to start init dispatch
 * @param waitModuleAry [HexStore] array of stores to ensure init
 * @param callback {Function} function to call when ready
 */
  getReady: function(initAction, waitModuleAry, callback) {
    this._waitModuleCount = 0;
    this._initAction = initAction;
    this._callback = callback;
    this._storeInitHandler = this._onStoreInitDone.bind(this);

    // Mobile have to start app after 'deviceready' event is fired
    // EboxUiAction.appInit -> _onStoreInitDone -> render
    if (checker.isMobile()) {
      var _this = this;
      document.addEventListener('deviceready', function() {
        _this._initModules(waitModuleAry);
        // Path Need to be ready
        HexPathMgr.addReadyListener(function() {
          // Dispatch App Init
          _this._initAction();
        });

        HexPathMgr.prepare();
        if($(window).width() <= 420)
        {
          window.screen.orientation.lock('portrait');
        }
      }, false);

      cordova.plugins.certificates.trustUnsecureCerts(true);

    } else {
      this._initModules(waitModuleAry);
      this._initAction();
    }
  },

  _initModules: function(waitModuleAry) {
    if (checker.isArray(waitModuleAry) && waitModuleAry.length > 0) {
      // Listen to preference ready
      this._waitStoreDict = {};
      var storeCount = waitModuleAry.length;
      this._storeReadyCount = 0;

      var curStore;
      for (var i = 0; i < storeCount; i++) {
        curStore = waitModuleAry[i];
        curStore.addReadyListener(this._storeInitHandler);
        this._waitStoreDict[waitModuleAry[i].getId()] = curStore;
      }

      this._waitModuleCount = storeCount;

    } else {
      // Direct render if no need to init pref
      this._ready();
    }
  },

  _onStoreInitDone: function(storeId) {
    var readyStore = this._waitStoreDict[storeId];

    if (!checker.isSetNonNull(readyStore)) {
      logger.info('Store Ready but not found: ' + storeId, MODULE_ID);
      return;
    }

    logger.info(
      'Store Ready: ' + storeId + ', ' + this._storeReadyCount, MODULE_ID);

    readyStore.removeReadyListener(this._storeInitHandler);

    this._storeReadyCount++;
    if (this._storeReadyCount == this._waitModuleCount) {
      // All Ready
      this._ready();
    }
  },

  _ready: function() {
    if (checker.isFunction(this._callback)) {
      this._callback();
    }
  }
};

module.exports = HexAppLoader;
