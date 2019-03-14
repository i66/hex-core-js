'use strict';

var HexConnectionStatus = require('../types/hex.connection.status');

// Tools
var logger = require('../../core/tools/hex.logger');
var checker = require('../../core/tools/hex.checker');

const MODULE_ID = 'HexWebSocketHtmlClient';

var _serverIp = window.location.hostname;
var _serverPort = 6643;
var _isSecure = false;
var RECONNECT_INTERVAL = 5000;

var _client = null;

var _callbacks = {};
var _callbackId = 0;

var _statusCallbacks = {};
var _statusCallbackId = 0;

var _logIdx = 0;
var _reconnectInterval = RECONNECT_INTERVAL;
var _reconnectHandle = null;
var _isReconnect = true;

//var _serverIp = _serverIp;
//var _serverPort = _serverPort;
var _isStopped = false;
var _useCustomClient = false;
var _timerId = null;

var HexWebSocketHtmlClient = {

  // Public functions
  // -----------------------------------------------------------------

  start: function() {
    _isStopped = false;
    this.connectServer();
  },

  stop: function() {
    if (_client != null) {
      _client.close(1000);
    }
    if (_reconnectHandle != null) {
      clearTimeout(_reconnectHandle);
      _reconnectHandle = null;
    }
    _isStopped = true;
  },

  setReconnectInterval: function(interval) {
    _reconnectInterval = interval;
  },

  setServerInfo: function(serverIp, serverPort, isSecure) {
    this.setServerIp(serverIp);
    this.setServerPort(serverPort);
    if (checker.isPc()) {
      this.setIsSecure(isSecure);
    } else {
      this.setIsSecure(checker.isSsl());
    }

  },

  setServerIp: function(serverIp) {
    if (checker.isWeb() && !checker.isMobile()) {
      return;
    }
    _serverIp = serverIp;
  },

  setServerPort: function(serverPort) {
    _serverPort = serverPort;
  },

  setIsSecure: function(isSecure) {
    _isSecure = isSecure;
  },

  getReconnectionInterval: function() {
    return _reconnectInterval;
  },

  getServerIp: function() {
    return _serverIp;
  },

  getServerPort: function() {
    return _serverPort;
  },

  isStopped: function() {
    return _isStopped;
  },

  isConnected: function() {
    if (_client == null) {
      return false;
    }
    return _client.connected;
  },

  isReconnect: function() {
    return _isReconnect;
  },

  setIsReconnect: function(isReconnect) {
    _isReconnect = isReconnect;
  },

  setWebSocketClient: function(wsClient) {
    _client = wsClient;
    _useCustomClient = true;
  },

  keepAlive: function() {
    var timeout = 20000;
    if (this.isConnected()) {
      logger.info('Keep Alive >>>>>>', MODULE_ID);
      _client.send('');
    }
    _timerId = setTimeout(this.keepAlive.bind(this), timeout);
  },

  cancelKeepAlive: function() {
    if (_timerId) {
      clearTimeout(_timerId);
      _timerId = null;
    }
  },

  connectServer: function() {

    var serverIp = _serverIp;
    var serverPort = _serverPort;

    var token = serverIp.split(':');
    if (token.length > 1) {
      serverIp = token[0];
    }

    logger.infoBold(
      'Connecting to Server >>>>>> ' +  _serverIp + ':' + _serverPort,
      MODULE_ID);

    this._emitStatus(HexConnectionStatus.CONNECTING);

    if (!_useCustomClient) {
      if (_isSecure || checker.isCloudLogin()) {
        _client = new WebSocket(
          'wss://' + serverIp + ':' + serverPort + '/');
      } else {
        _client = new WebSocket('ws://' + serverIp + ':' + serverPort + '/');
      }
      _client.connected = false;
    }

    var _this = this;

    _client.onopen = function() {
      logger.info('Connected >>>>>>', MODULE_ID);
      _client.connected = true;
      _this._emitStatus(HexConnectionStatus.CONNECTED);
      _this.keepAlive.bind(_this)();
    };

    _client.onerror = function(e) {
      logger.warn('Connection error >>>>>> ' + e, MODULE_ID);
    };

    _client.onclose = function(e) {
      logger.info('Connection closed >>>>>> ' +
                  e.code + ':' + e.reason, MODULE_ID);
      _this.cancelKeepAlive.bind(_this)();
      if (!_isStopped) {
        _this._reconnectServer();
      }
    };

    _client.onmessage = function(e) {
      _this._emitData(e.data);
    };

  },

  // Message notifier
  addDataListener: function(callback) {
    _callbackId++;
    var id = 'ID_' + _callbackId;
    _callbacks[id] = callback;
    return id;
  },

  removeDataListener: function(id) {
    if (checker.isSet(_callbacks[id])) {
      delete _callbacks[id];
    } else {
      logger.error('Callback is not registered: ' + id);
    }
  },

  // Status notifier
  addStatusListener: function(callback) {
    _statusCallbackId++;
    var id = 'ID_' + _statusCallbackId;
    _statusCallbacks[id] = callback;
    return id;
  },

  removeStatusListener: function(id) {
    if (checker.isSet(_statusCallbacks[id])) {
      delete _statusCallbacks[id];
    } else {
      logger.error('Statis Listener is not registered: ' + id, MODULE_ID);
    }
  },

  unregisterAll: function() {
    _callbacks = {};
    _callbackId = 0;
    _statusCallbacks = {};
    _statusCallbackId = 0;
  },

  send: function(dataObj) {
    var msg = JSON.stringify(dataObj);
    if (this.isConnected()) {
      _client.send(msg);
    } else {
      logger.error(
        'send - server not connected, not gonna send:' + msg, MODULE_ID);
    }
  },

  // Private functions
  // -----------------------------------------------------------------

  _reconnectServer: function() {
    if (_isReconnect == false) {
      return;
    }
    logger.info('Reconnect in ' +
                (_reconnectInterval / 1000) +  ' sec >>>>>> ', MODULE_ID);
    var _this = this;

    // Prevent multiple trigger
    if (_reconnectHandle != null) {
      clearTimeout(_reconnectHandle);
    }

    _reconnectHandle = setTimeout(function() {
      _this.connectServer();
    }, _reconnectInterval);
  },

  _emitData: function(payload) {
    this._emit(_callbacks, payload);
  },

  _emitStatus: function(status) {
    this._emit(_statusCallbacks, status);
  },

  _emit: function(callbackMap, data) {
    for (var id in callbackMap) {
      callbackMap[id](data);
    }
  }
};

module.exports = HexWebSocketHtmlClient;
