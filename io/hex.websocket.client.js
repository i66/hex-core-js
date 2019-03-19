'use strict';

var WebSocketClient = global.require('websocket').client;
var HexConnectionStatus = require('../types/hex.connection.status');

// Tools
var logger = require('../../core/tools/hex.logger');
var checker = require('../../core/tools/hex.checker');

const MODULE_ID = 'HexWebSocketClient';

var _serverIp = '0.0.0.0';
var _serverPort = 6643;
var RECONNECT_INTERVAL = 5000;

var _client = null;
var _wsCon = null;

var _callbacks = {};
var _callbackId = 0;

var _statusCallbacks = {};
var _statusCallbackId = 0;

var _logIdx = 0;
var _reconnectInterval = RECONNECT_INTERVAL;
var _reconnectHandle = null;
var _isReconnect = true;

var _serverIp = _serverIp;
var _serverPort = _serverPort;
var _isSecure = false;
var _isStopped = false;
var _useCustomClient = false;
var _timerId = null;

var HexWebSocketClient = {

  // Public functions
  // -----------------------------------------------------------------

  start: function() {
    if (typeof process === 'undefined') {
      logger.warn(
        'Running in non-Node.JS environment, WebSocket Client init is aborted.',
      MODULE_ID);
      return;
    }

    _isStopped = false;
    this.connectServer();
  },

  stop: function() {
    if (_wsCon != null) {
      _wsCon.close(1000);
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
    this.setIsSecure(isSecure);
  },

  setServerIp: function(serverIp) {
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
    if (_wsCon == null) {
      return false;
    }
    return _wsCon.connected;
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
      _wsCon.sendUTF('');
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

    if (!_useCustomClient) {
      _client = new WebSocketClient();
    }

    if (_isSecure) {
      _client.connect(
        'wss://' + _serverIp + ':' + _serverPort + '/', null, null, null, null);
    } else {
      _client.connect(
        'ws://' + _serverIp + ':' + _serverPort + '/', null, null, null, null);
    }

    logger.infoBold(
      'Connecting to Server >>>>>> ' +  _serverIp + ':' + _serverPort,
      MODULE_ID);

    this._emitStatus(HexConnectionStatus.CONNECTING);

    var _this = this;

    _client.on('connect', function(webSocketConnection) {
      _wsCon = webSocketConnection;
      logger.info('Connected >>>>>>', MODULE_ID);
      _this._emitStatus(HexConnectionStatus.CONNECTED);
      _this.keepAlive.bind(_this)();

      // Event definition
      _wsCon.on('message', function(message) {
        if (typeof message.type !== 'undefined' && message.type == 'utf8') {
          // logger.log('Message >>>>>> ' + message.utf8Data, MODULE_ID);
          _this._emitData(message.utf8Data);
        } else {
          logger.warn('Wrong Message type >>>>>> ' +
            JSON.stringify(message), MODULE_ID);
        }
      });

      _wsCon.on('error', function(error) {
        logger.warn('Connection error >>>>>> ' + error, MODULE_ID);
      });

      _wsCon.on('close', function(reasonCode, description) {
        logger.info('Connection closed >>>>>> ' +
                    reasonCode + ':' + description, MODULE_ID);
        _this.cancelKeepAlive.bind(_this)();
        if (!_isStopped) {
          _this._reconnectServer();
        }
      });
    });

    _client.on('httpResponse', function(response, webSocketClient) {
      logger.info('httpResponse >>>>>> ' + response, MODULE_ID);
    });

    _client.on('connectFailed', function(errorDescription) {
      logger.info('Disconnected >>>>>> ' + errorDescription, MODULE_ID);
      _this._emitStatus(HexConnectionStatus.DISCONNECTED);
      _this.cancelKeepAlive();
      if (_wsCon != null) {
        if (_wsCon.connected) {
          _wsCon.close(1000, 'Server disconnected');
        }
        _wsCon = null;
      }

      if (!_isStopped) {
        _this._reconnectServer();
      }
    });
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
      _wsCon.sendUTF(msg);
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

module.exports = HexWebSocketClient;
