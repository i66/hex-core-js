var checker = require('../../tools/hex.checker');
var logger = require('../../tools/hex.logger');

var _callbacks = [];
var _promises = [];

var _isDispatching = false;
var _isHandled = [];  // Boolean Array
var _isPending = [];  // Boolean Array
var _lastID = 1; // Number
var _pendingPayload = null;
var _prefix = 'ID_';

var moduleId = 'BaseDispatcher';

var BaseDispatcher = function() {};
BaseDispatcher.prototype = Object.assign({}, BaseDispatcher.prototype, {

  /**
   * Registers a callback to be invoked with every dispatched payload. Returns
   * a token that can be used with `waitFor()`.
   */
  register: function(callback) {
    var id = _prefix + _lastID++;
    _callbacks[id] = callback;
    //  logger.info('Registered: ' + id, moduleId);
    return id;
  },

  unregister: function(id) {
    if (!checker.isSet(_callbacks[id])) {
      //    logger.error('Callback with id ' + id + ' is not registered.', moduleId);
      return;
    }
    delete _callbacks[id];
  },

  dispatch: function(payload) {
    //logger.info('Dispatch: ' + JSON.stringify(payload), moduleId);
    if (_isDispatching) {
      logger.error('Previous dispatch is not finished.', moduleId);
      return;
      // Defer?
    }
    this._startDispatching(payload);

    for (var id in _callbacks) {
      if (_isPending[id]) {
        // Already running?
        continue;
      }
      this._invokeCallback(id);
    }

    this._stopDispatching();
    /*
      try {
        for (var id in _callbacks) {
          if (_isPending[id]) {
            // Already running?
            continue;
          }
          this._invokeCallback(id);
        }
      } catch (err){
        logger.error('Error in dispatch:' + err, moduleId);
      } finally {
        this._stopDispatching();
      }
      */
  },

  waitFor: function(ids) {
    if (!_isDispatching) {
      return;
    }
    for (var ii = 0; ii < ids.length; ii++) {
      var id = ids[ii];
      if (_isPending[id] && _isHandled[id]) {
        // Done
        continue;
      }

      if (!checker.isSet(_callbacks[id])) {
        logger.error('Wait id is not registered: ' + id, moduleId);
        continue;
      }
      this._invokeCallback(id);
    }
  },

  /**
   * Is this Dispatcher currently dispatching.
   */
  isDispatching: function() {
    return _isDispatching;
  },

  reset: function() {
    _callbacks = [];
    _promises = [];
    _isDispatching = false;
    _isHandled = [];
    _isPending = [];
    _lastID = 1;
    _pendingPayload = null;
  },

  /**
   * Call the callback stored with the given id. Also do some internal
   * bookkeeping.
   *
   * @internal
   */
  _invokeCallback: function(id) {
    //  logger.info('Dispatching... - ' + id, moduleId);
    _isPending[id] = true;
    _callbacks[id](_pendingPayload);
    //  logger.info('Dispatched Done - ' + id, moduleId);
    _isHandled[id] = true;
  },

  /**
   * Set up bookkeeping needed when dispatching.
   *
   * @internal
   */
  _startDispatching: function(payload) {
    //  logger.info('Start Dispatch!', moduleId);
    for (var id in _callbacks) {
      _isPending[id] = false;
      _isHandled[id] = false;
    }
    _pendingPayload = payload;
    _isDispatching = true;
  },

  /**
   * Clear bookkeeping used for dispatching.
   *
   * @internal
   */
  _stopDispatching: function() {
    //    logger.info('Stop Dispatch!', moduleId);
    _pendingPayload = null;
    _isDispatching = false;
  }

});

module.exports = BaseDispatcher;
