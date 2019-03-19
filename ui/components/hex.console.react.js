'use strict';

// External Modules
var React = require('react');
var createReactClass = require('create-react-class');
var TweenMax = require('gsap').TweenMax;

// Constants and Types
var HexPropType = require('../types/hex.prop.type');
var HexLogType = require('../types/hex.log.type');

// Modules
var HexActions = require('../action/hex.action');
//var EboxUiRunModeMgr = require('../io/eboxui.run.mode.mgr');
//var EboxUiConsoleMsgHandler = require('../io/eboxui.console.msg.handler');
//var EboxUiMsgIoHandler = require('../io/eboxui.msg.io.handler');
var HexLifeCycleHelperClass =
    require('./helper/hex.lifecycle.helper.class');

// Stores
var HexConsoleStore = require('../stores/hex.console.store');

// Tools
var checker = require('../tools/hex.checker');
var util = require('../tools/hex.util');
var format = require('../tools/hex.format');

const MODULE_ID = 'HexConsole';
const MODULE_ID_LOG = 'HexConsoleLog';
const MODULE_ID_INFO = 'HexConsoleInfo';

const INTERVAL_UPDATE = 10000;
const TPL_DATETIME = 'yyyy-MM-dd HH:mm:ss';
const TPL_RUNTIME = 'dd day, hh hr mm min';

const KEY_CODE_ENTER = 13;
const KEY_CODE_UP = 38;
const KEY_CODE_DOWN = 40;
const KEY_CODE_ESC = 27;

var EBoxUiComponentMixin = require('../components/hex.component.mixin');

var info = require('../io/hex.app-info.mgr').getInfo();

var _extData = [];
var _extRunmode = '';
var _extHandleFunc = null;

var _cmdHistoryAry = [];
var _lastCmdIdx = 0;

var _electronVer = 'N/A';
var _cliBrowser = '---';
var _cliBrowserVersion = '---';
var _cliEngine = '---';
var _cliEngineVersion = '---';
var _cliOs = '---';
var _cliOsVersion = '---';
var _cliResolution = '---';
var _cliColorDepth = '---';
var _cliTimeZone = '---';
var _cliLang = '---';
var _appStartTime = new Date();

var _regNewLine = /\n/g;
var _triggerHandle = null;

function getAppRunTime() {
  var curDate = new Date();
  return curDate - _appStartTime;
}

function setElectronVer() {
  if (checker.isSet(window.process) &&
      checker.isSet(window.process.versions.electron)) {
    _electronVer = window.process.versions.electron;
  } else {
    _electronVer = 'N/A';
  }
}

function setClientInfo() {
  if (checker.isSet(ClientJS)) {
    var clientJS = new ClientJS();
    _cliBrowser = clientJS.getBrowser();
    _cliBrowserVersion = clientJS.getBrowserVersion();
    _cliEngine = clientJS.getEngine();
    _cliEngineVersion = clientJS.getEngineVersion();
    _cliOs = clientJS.getOS();
    _cliOsVersion = clientJS.getOSVersion();
    _cliResolution = clientJS.getCurrentResolution();
    _cliColorDepth = clientJS.getColorDepth();
    _cliTimeZone = clientJS.getTimeZone();
    _cliLang = clientJS.getLanguage();
  }
}

var HexConsoleInfo = createReactClass({

  _memoryTimer: null,
  _jsHeapSizeLimit: 0,
  _totalJSHeapSize: 0,
  _usedJSHeapSize: 0,

  // Render functions
  // -----------------------------------------------------------------
  render: function() {
    var appStartTime = format.formatDate(_appStartTime, TPL_DATETIME);
    var appUpTime = format.formatTimeSpan(getAppRunTime(), TPL_RUNTIME);
    //var apiConnectionStatus = EboxUiMsgIoHandler.getConnectionStatus();
    //var apiLastConnectedTime = EboxUiMsgIoHandler.getLastConnectedTime();

    var apiConnectionStatus = '---';
    var apiLastConnectedTime = '---';

    if (apiLastConnectedTime == null) {
      apiLastConnectedTime = '---';
    } else {
      apiLastConnectedTime = format.formatDate(
        apiLastConnectedTime, TPL_DATETIME);
    }

    return (
        <div className='console-info' id='console-info'>
          <div className='build-info console-info-panel' id='build-info'>
            Code Name: {info.codeName}<br/>
            Build Time: {info.buildTs}<br/>
            Build Rev: {info.buildNo}<br/>
            Description: <br/>{info.description}<br/>
          </div>
          <div className='memory-info console-info-panel' id='memory-info'>
            Start Time: {appStartTime}<br/>
            Up Time: {appUpTime}<br/>
            API Connection: {apiConnectionStatus}<br/>
            API Last Connected: {apiLastConnectedTime}<br/>
            jsHeapSizeLimit: {this._jsHeapSizeLimit}<br/>
            totalJSHeapSize: {this._totalJSHeapSize}<br/>
            usedJSHeapSize: {this._usedJSHeapSize}<br/>
          </div>
          <div className='client-info console-info-panel' id='client-info'>
            Electron: {_electronVer}<br/>
            Browser: {_cliBrowser} / {_cliBrowserVersion}<br/>
            Engine: {_cliEngine} / {_cliEngineVersion}<br/>
            OS: {_cliOs} / {_cliOsVersion}<br/>
            Resolution: {_cliResolution} / {_cliColorDepth}<br/>
            Locale: {_cliTimeZone} / {_cliLang}<br/>
          </div>
        </div>
    );
  },

  // Override functions
  // -----------------------------------------------------------------
  componentDidMount: function(prevProps, prevState) {
    this._memoryTimer = setInterval(this._updateMemoryUsage, INTERVAL_UPDATE);
    this._updateMemoryUsage();

    setElectronVer();
    setClientInfo();

  },

  componentWillUnmount: function() {
    clearInterval(this._memoryTimer);
  },

  // Private functions
  // -----------------------------------------------------------------
  _updateMemoryUsage: function() {
    var memoryInfo = window.performance.memory;
    this._jsHeapSizeLimit = format.formatBytes(memoryInfo.jsHeapSizeLimit, 2);
    this._totalJSHeapSize = format.formatBytes(memoryInfo.totalJSHeapSize, 2);
    this._usedJSHeapSize = format.formatBytes(memoryInfo.usedJSHeapSize, 2);
    this.forceUpdate();
  },

});

var HexConsole = createReactClass({
  lifeCycleHelper: null,
  mixins: [EBoxUiComponentMixin],

  // Render functions
  // -----------------------------------------------------------------
  _mxRenderProto: function() {
    return (
      <HexProto module_id={MODULE_ID}/>
    );
  },

  _mxRenderDetail: function() {
    var logs = _extData;
    var runModeStr = _extRunmode;
    var _this = this;

    return (
      <div ref='console' className='console' id='console'>
        {/* Log content */}
        <div className='console-log' id='console-log'>
          <div ref='container' className='console-log-content' >
            {logs.map(function(log, idx) {
              return _this._uiGetLogContent(log);
            })}
          </div>
        </div>

        <HexConsoleInfo  />
        <div className='console-input'>
          &gt;<input ref='input' id='console-input'
                onKeyDown={this._onConsoleInput} autoFocus/>
        </div>
        {/* Log footer */}
        <div className='console-footer' id='console-footer'>
          <div className='console-logo'
            onMouseDown={this._setConsoleTrigger}
            onMouseUp={this._clearConsoleTrigger} ></div>
          <div className='version' >
            <span id='app-name'>{info.nameFull}</span> v
            <span id='app-version'>{info.version}</span>
            <span id='app-build'> r{info.buildNo}</span>
            <span> / {runModeStr}</span>
          </div>
        </div>
      </div>
    );
  },

  _uiGetLogContent: function(log) {
    var css = 'log ';
    switch (log[0]){
      case HexLogType.INFO:
        css += 'log-info';
        break;
      case HexLogType.WARN:
        css += 'log-warn';
        break;
      case HexLogType.ERROR:
        css += 'log-error';
        break;
      case HexLogType.INFO_BOLD:
        css += 'log-bold';
        break;
      case HexLogType.INFO_EMP:
        css += 'log-emp';
        break;
      case HexLogType.INFO_INPUT:
        css += 'log-input';
        break;
      case HexLogType.MAIN:
        css += 'log-main';
        break;
      case HexLogType.CONSOLE:
        css += 'log-console';
        break;
    }
    // Replace \n to <br/>
    var msg = log[1];
    if (msg.indexOf('\n') != -1) {
      var idx = 0;
      msg = log[1].split('\n').map(function(item) {
        idx++;
        return (
          <span key={log[2] + '_' + idx}>
            {item}
            <br/>
          </span>
        );
      });
    }

    return (
      <div className={css} key={log[2]}>{msg}</div>
    );
  },

  // Public functions
  // -----------------------------------------------------------------
  In: function() {
    var target = this.refs.console;
    var winHeight = $(window).height();

    TweenMax.set(target, {y: -1 * winHeight});
    TweenMax.to(target, 0.5, {
      y: 0,
      ease: global.Expo.easeOut,
    });
  },

  Out: function(callback) {
    var target = this.refs.console;
    var winHeight = $(window).height();

    TweenMax.to(target, 0.5, {
      y: -1 * winHeight,
      ease: Expo.easeOut,
      onComplete: function() {
        callback();
      }
    });
  },

  clear: function() {
    this.mxUpdateStatVal(HexPropType.DATA, []);
  },

  // Override functions
  // -----------------------------------------------------------------
  _initLifeCycleHelper: function() {
    this.lifeCycleHelper = new HexLifeCycleHelperClass(MODULE_ID, this);
    this.lifeCycleHelper.addCheckStatKey(HexPropType.DATA);

    this.lifeCycleHelper.setInitFunc(this._onInit);
    this.lifeCycleHelper.setUninitFunc(this._onUnInit);

    this.lifeCycleHelper.setInitStat(
      HexPropType.DATA, HexConsoleStore.getAll());
  },

  _mxUpdateProps: function() {
    _extData = this.mxGetState(HexPropType.DATA, []);
    _extRunmode = this.mxGetProp(HexPropType.RUNMODE);
    _extHandleFunc = this.mxGetProp(HexPropType.ON_MSG, null);
  },

  _mxOnMount: function() {
    this.In();
    this._scrollTop();
  },

  _mxOnRendered: function() {
    this._scrollTop();
  },

  // Private functions
  // -----------------------------------------------------------------

  _scrollTop: function() {
    this.refs.container.scrollTop = this.refs.container.scrollHeight;
  },

  // Event functions
  // -----------------------------------------------------------------
  _onInit: function() {
    HexConsoleStore.addChangeListener(this._onChange);
  },

  _onUnInit: function() {
    HexConsoleStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.mxUpdateStatVal(HexPropType.DATA, HexConsoleStore.getAll());
  },

  _getLastCmd: function() {
    if (_cmdHistoryAry.length > 0) {
      return _cmdHistoryAry[_lastCmdIdx];
    }
    return null;
  },

  _ensureLastCmd: function() {
    if (_lastCmdIdx < 0) {
      _lastCmdIdx = _cmdHistoryAry.length - 1;
    } else if (_lastCmdIdx >= _cmdHistoryAry.length) {
      _lastCmdIdx = 0;
    }
  },

  _onConsoleInput: function(e) {
    //console.log(e.keyCode);
    if (e.keyCode == KEY_CODE_ENTER) {
      var cmd = this.refs.input.value;
      if (checker.isNonEmptyStr(cmd)) {
        var cmdHistoryLength = _cmdHistoryAry.length;
        if (cmdHistoryLength == 0 ||
            _cmdHistoryAry[cmdHistoryLength - 1] != cmd) {
          _cmdHistoryAry.push(cmd);
          _lastCmdIdx = _cmdHistoryAry.length - 1;
        }

        if (checker.isSetNonNull(_extHandleFunc)) {
          _extHandleFunc(this.refs.input.value);
        }

        this.refs.input.value = '';
      }
    } else if (e.keyCode == KEY_CODE_UP) {
      var lastCmd = this._getLastCmd();
      if (lastCmd != null) {
        this.refs.input.value = lastCmd;
        setTimeout(function() {
          $('#console-input').focusTextToEnd();
        }, 50);

        _lastCmdIdx--;
        this._ensureLastCmd();
      }
    } else if (e.keyCode == KEY_CODE_DOWN) {
      var lastCmd = this._getLastCmd();
      if (lastCmd != null) {
        this.refs.input.value = lastCmd;
        _lastCmdIdx++;
        this._ensureLastCmd();
      }
    } else if (e.keyCode == KEY_CODE_ESC) {
      this.refs.input.value = '';
    }
  },

  _setConsoleTrigger: function() {
    _triggerHandle = setTimeout(function() {
      HexActions.toggleConsole();
    }, 1000);
  },
  _clearConsoleTrigger: function() {
    clearTimeout(_triggerHandle);
  }

});

// JQuery patch
(function($) {
  $.fn.focusTextToEnd = function() {
      this.focus();
      var $thisVal = this.val();
      this.val('').val($thisVal);
      return this;
    };
}(jQuery));

module.exports = HexConsole;
