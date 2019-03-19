'use strict';

// External Modules
var http = global.require('http');
var url = global.require('url');
var WebSocketServer = global.require('websocket').server;

// Tools
var logger = require('../../core/tools/hex.logger');
var checker = require('../../core/tools/hex.checker');

const MODULE_ID = 'HexWebSocketServer';
const MSG_TYPE_UTF8 = 'utf8';
const DEFAULT_SERVER_PORT = 6643;

var _callbacks = {};
var _callbackId = 0;

var _statusCallbacks = {};
var _statusCallbackId = 0;

var _httpServer = null;
var _wsServer = null;
var _serverPort = DEFAULT_SERVER_PORT;
var _connectionPool = [];
var _idSerial = 0;

var HexWebSocketServer = {

  // Public functions
  // -----------------------------------------------------------------
  start: function(serverPort) {
    this.setServerPort(serverPort);
    var server = http.createServer(function(request, response) {});

    server.listen(_serverPort, function() {
      logger.infoCore(
        'Server has started and is listening on port ' + _serverPort,
        MODULE_ID);
      _httpServer = server;
    });

    _wsServer = new WebSocketServer({
      httpServer: server,
    });
    _wsServer.on('request', this.onWsRequest.bind(this));
  },

  stop: function() {
    this._closeHttpServer();
    this._closeWebsocketServer();
    logger.infoCore(
      'Server has stopped', MODULE_ID);
    _idSerial = 0;
    _connectionPool = [];
  },

  setServerPort: function(serverPort) {
    _serverPort = serverPort;
  },

  sendData: function(data, clientId) {
    var msg = JSON.stringify(data);
    this.sendMsg(msg, clientId);
  },

  sendMsg: function(msg, clientId) {
    if (checker.isSetNonNull(clientId)) {
      var connection = _connectionPool[clientId];
      if (checker.isSetNonNull(connection)) {
        _connectionPool[clientId].sendUTF(msg);
        logger.info('Sent to client id: ' +
          clientId + '\n' + msg, MODULE_ID, logger.DEBUG);
      } else {
        logger.warn('Client id not found:' + clientId, msg, MODULE_ID);
      }

    } else {
      // Broadcast
      for (var i in _connectionPool) {
        _connectionPool[i].sendUTF(msg);
      }

      logger.info('Sent to all clients / ' +
        _connectionPool.length + ': \n' + msg, MODULE_ID, logger.DEBUG);
    }

  },

  getClientList: function() {
    var clientList = [];
    for (var id in _connectionPool) {
      clientList.push('Id: ' + id + ', Addr: ' +
        _connectionPool[id].remoteAddress);
    }
    return clientList;
  },
  dropClient: function(clientId) {
    if (_wsServer != null) {
      var connection = _connectionPool[clientId];
      if (checker.isSetNonNull(connection)) {
        connection.close();
      }
    }
  },
  dropAllClient: function() {
    if (_wsServer != null) {
      _wsServer.closeAllConnections();
    }
  },

  // Private functions
  // -----------------------------------------------------------------
  _closeWebsocketServer: function() {
    if (_wsServer != null) {
      _wsServer.closeAllConnections();
      _wsServer.shutDown();
      _wsServer = null;
    }
  },

  _closeHttpServer: function() {
    if (_httpServer != null) {
      _httpServer.close();
      _httpServer = null;
    }
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
  },

  // Event functions
  // -----------------------------------------------------------------
  onWsRequest: function(r) {
    var connection = r.accept(null, r.origin);
    var clientId = String(_idSerial);
    logger.infoCore('Connection accepted: Client_' + clientId + ', ' +
      connection.remoteAddress);
    _connectionPool[clientId] = connection;
    connection.on('message', this.onWsConnMessage.bind(this, clientId));
    connection.on('close', this.onWsConnClose.bind(this, clientId));
    _idSerial++;
  },

  onWsConnMessage: function(id, message) {
    if (message.type == MSG_TYPE_UTF8) {
      var payload = {};
      payload.id = id;
      payload.data = message.utf8Data;
      this._emitData(payload);
    } else {
      logger.info('Received non-UTF data:', message, MODULE_ID);
    }
  },

  onWsConnClose: function(id, reasonCode, description) {
    var addr = 'N/A';
    if (checker.isSetNonNull(_connectionPool[id])) {
      addr = _connectionPool[id].remoteAddress;
      delete _connectionPool[id];
    }

    logger.infoCore('Client Disconnected - ' + id + ', ' + addr, MODULE_ID);
  },


};

module.exports = HexWebSocketServer;
