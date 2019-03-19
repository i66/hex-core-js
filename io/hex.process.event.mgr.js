
var remote;
var ipcRenderer;
try {
  remote = global.require('electron').remote;
  ipcRenderer = global.require('electron').ipcRenderer;
} catch (ex) {
  // Not Supported
}

var EventEmitter = require('events').EventEmitter;

// Store
var HexRemoteActionType = require('../../core/types/hex.remote.action.type');
var HexAppConstant = require('../../core/types/hex.app.constant');
var checker = require('../../core/tools/hex.checker');
var logger = require('../../core/tools/hex.logger');

const MODULE_ID = 'HexProcessEventMgr';

var _isAboutQuit = false;
var _isConfirmedQuit = false;
var _appCloseHandler = null;
var _isInit = false;

var HexProcessEventMgr = Object.assign({}, EventEmitter.prototype, {

  init: function() {
    if (!_isInit) {
      this.setMaxListeners(20);
      this._hookAppCloseHandler();
      this._hookMainThreadEventHandler();
      _isInit = true;
    }

  },

  addListener: function(actionType, handler) {
    this.on(actionType, handler);
  },

  addUpdateListener: function(handler) {
    this.on(HexRemoteActionType.NO_UPDATE, handler);
    this.on(HexRemoteActionType.CHECKING_UPDATE, handler);
    this.on(HexRemoteActionType.UPDATE_AVAILABLE, handler);
    this.on(HexRemoteActionType.CONFIRM_UPDATE, handler);
  },

  addAppCloseHandler: function(handler) {
    if (checker.isFunction(handler)) {
      _appCloseHandler = handler;
    }
  },

  checkForUpdate: function(serverUrl) {
    if (!checker.isSetNonNull(serverUrl)) {
      serverUrl = HexAppConstant.UPDATE_SERVER_URL;
    }

    if (!checker.isSetNonNull(ipcRenderer)) {
      return;
    }
    // Call main process
    ipcRenderer.send(
      HexRemoteActionType.CHECK_UPDATE, {serverUrl: serverUrl});
  },

  relaunchAndUpdate: function() {
    if (!checker.isSetNonNull(ipcRenderer)) {
      return;
    }
    ipcRenderer.send(HexRemoteActionType.CONFIRM_UPDATE_DONE);
  },

  setFullScreen: function(isFullScreen) {
    if (!checker.isSetNonNull(ipcRenderer)) {
      if (checker.isSetNonNull(window.require)) {
        var ngui = window.require('nw.gui');
        var nwin = ngui.Window.get();
        if (isFullScreen) {
          nwin.enterFullscreen();
        } else {
          nwin.leaveFullscreen();
        }
      }
      return;
    } else {
      ipcRenderer.send(
        HexRemoteActionType.SET_FULL_SCREEN, {isFullScreen: isFullScreen});
    }
  },

  _onConfirmedAppClose: function() {
    _this.emit(HexRemoteActionType.APP_CLOSE);
    var win = remote.getCurrentWindow();
    win.removeListener('close', onWindowClose);
  },

  _hookAppCloseHandler: function() {
    if (!checker.isSetNonNull(remote)) {
      return;
    }
    var win = remote.getCurrentWindow();
    win.on('close', function() {
      _isAboutQuit = true;
    });

    var _this = this;
    global.window.onbeforeunload = function(e) {
      if (_isConfirmedQuit == true) {
        //e.returnValue = true;
        return;
      }else {
        if (_isAboutQuit == true) {
          _isAboutQuit = false;
          var isQuit = _appCloseHandler();
          if (isQuit) {
            _this._onConfirmedAppClose();
            return;
          } else {
            return false;
          }
        }else {
          // reload
          _this._onConfirmedAppClose();
          return;
        }
      }
    };

  },

  _hookMainThreadEventHandler: function() {
    if (!checker.isSetNonNull(ipcRenderer)) {
      return;
    }
    var _this = this;
    // Log Msg from main thread
    ipcRenderer.on(HexRemoteActionType.LOG,
      function(event, data) {
        _this.emit(HexRemoteActionType.LOG, data);
      }
    );

    ipcRenderer.on(HexRemoteActionType.CHECKING_UPDATE,
      function(event, data) {
        _this.emit(HexRemoteActionType.CHECKING_UPDATE);
      }
    );

    ipcRenderer.on(HexRemoteActionType.NO_UPDATE,
      function(event, data) {
        _this.emit(HexRemoteActionType.NO_UPDATE);
      }
    );

    ipcRenderer.on(HexRemoteActionType.UPDATE_AVAILABLE,
      function(event, data) {
        _this.emit(HexRemoteActionType.UPDATE_AVAILABLE);
      }
    );

    ipcRenderer.on(HexRemoteActionType.CONFIRM_UPDATE,
      function(event, data) {
        _this.emit(HexRemoteActionType.CONFIRM_UPDATE, data);
      }
    );
  },

});

module.exports = HexProcessEventMgr;
