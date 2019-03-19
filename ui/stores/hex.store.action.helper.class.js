// External Modules
var uuid = require('uuid');
var Immutable = require('immutable');

// Constants and Types
var HexPrimitiveType = require('../../types/hex.primitive.type');

// Modules
var HexUUIdMgr = require('../../io/hex.uuid.mgr');
var HexFieldTypeMgr = require('../../io/hex.field-type.mgr');

// Tools
var checker = require('../../tools/hex.checker');
var logger = require('../../tools/hex.logger');
var validator = require('../../tools/hex.validator');

var HexStoreActionHelperClass = function(scope, storeModuleId) {
  this.scope = scope;
  this.actionMap = {};
  this.actionMapAsync = {};
  if (checker.isSetNonNull(storeModuleId)) {
    this.moduleId = storeModuleId;
  } else {
    this.moduleId = 'HexStoreActionHelper';
  }
};

HexStoreActionHelperClass.prototype.registerAction =
function(actionType, handler) {
  this.actionMap[actionType] = handler;
};

HexStoreActionHelperClass.prototype.registerActionAsync =
function(actionType, handler) {
  this.actionMapAsync[actionType] = handler;
};

HexStoreActionHelperClass.prototype.isSyncHandler = function(param, storeData) {
  return checker.isSet(this.actionMap[param.actionType]);
};

HexStoreActionHelperClass.prototype.isAsyncHandler =
function(param, storeData) {
  return checker.isSet(this.actionMapAsync[param.actionType]);
};

HexStoreActionHelperClass.prototype.handleEvent = function(param, storeData) {
  var res = null;
  var updatedData = null;

  // Check map
  var actionFunc = this.actionMap[param.actionType];

  if (checker.isSet(actionFunc)) {
    try {
      res = actionFunc.call(
        this.scope, storeData, param.method, param.data);

      if (checker.isSetNonNull(res)) {
        if (!checker.isSet(res.data) && !checker.isSet(res.error)) {
          logger.error(
            'Invalid result format:' + JSON.stringify(res) , this.moduleId);
        }
        if (res.error != null) {
          logger.error(res.error, this.moduleId);
        }
        if (checker.isSet(res.data)) {
          updatedData = res.data;
        }

      }
    } catch (e) {
      console.error(e);
      logger.error(e.toString(), this.moduleId);
    }
  }
  return updatedData;
};

HexStoreActionHelperClass.prototype.handleEventAsync =
function(param, storeData, callback) {

  var actionFunc = this.actionMapAsync[param.actionType];

  if (checker.isSet(actionFunc)) {
    actionFunc.call(
      this.scope, storeData, param.method, param.data, function(res) {
        var updatedData = null;
        if (checker.isSetNonNull(res)) {
          if (!checker.isSet(res.data) && !checker.isSet(res.error)) {
            logger.error(
              'Invalid result format:' + JSON.stringify(res) , this.moduleId);
          }
          if (res.error != null) {
            logger.error(res.error, this.moduleId);
          }
          if (checker.isSet(res.data)) {
            updatedData = res.data;
          }

          callback(updatedData);

        }
      });
  }
};

module.exports = HexStoreActionHelperClass;
