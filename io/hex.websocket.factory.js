var checker = require('../../core/tools/hex.checker');
const MODULE_ID = 'HexWebSocketFactory';

var HexWebSocketFactory = {
  getServer: function() {
    var server = null;
    if (checker.isWeb()) {
      server = null;
    } else {
      server = require('./hex.websocket.server');
    }
    return server;
  },
  getClient: function() {
    var client = null;
    client = require('./hex.websocket.html.client');
    /*
    if (checker.isWeb()) {
      client = require('./hex.websocket.html.client');
    } else {
      client = require('./hex.websocket.client');
    }
    */
    return client;
  }
};

module.exports = HexWebSocketFactory;
