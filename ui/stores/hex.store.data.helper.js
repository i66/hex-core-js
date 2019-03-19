// External Modules
var uuid = require('uuid');
var Immutable = require('immutable');

// Constants and Types
var HexPrimitiveType = require('../../types/hex.primitive.type');
var EboxUIFieldErrorType = require('../../types/hex.field.error.type');
var HexActionMethodType = require('../../types/hex.action.method.type');

// Modules
var HexUUIdMgr = require('../../io/hex.uuid.mgr');
var HexFieldPropMgr = require('../../io/hex.field-prop.mgr');
var HexFieldMapper = require('../../io/hex.field.mapper');
var HexStoreDataMgr = require('../../io/hex.store.data.mgr');

// Tools
var checker = require('../../tools/hex.checker');
var validator = require('../../tools/hex.validator');
var util = require('../../tools/hex.util');

const MODULE_ID = 'HexStoreDataHelper';

var HexStoreDataHelper = {

  initDefaultData: function(fieldType) {
    var initData = {};
    for (var typeId in fieldType) {
      var fieldInfo = fieldType[typeId];
      if (!checker.isSetNonNull(fieldInfo)) {
        continue;
      }
      var defaultValue = HexFieldPropMgr.getDefault(fieldInfo);
      if (checker.isSet(defaultValue)) {
        initData[fieldInfo] = defaultValue;
      }
    }
    return initData;
  },

  getRes: function(data, error) {
    if (!checker.isSetNonNull(error)) {
      error = null;
    }
    return {
      data: data,
      error: error
    };
  },

  getErrorRes: function(fieldKey, fieldValue, errorType) {
    return this.getRes(null,
      this.getFieldError(fieldKey, fieldValue, errorType)
     );
  },

  getUnsupportedMethodRes: function(fieldKey, method) {
    return this.getErrorRes(
      fieldKey, method, EboxUIFieldErrorType.UNSUPPORTED_METHOD);
  },

  getFieldError: function(fieldKey, fieldValue, errprMsg) {
    var error = {};
    error[fieldKey] = {
      value: fieldValue,
      type: errprMsg
    };
    return error;
  },

  handleActionMapArray: function(fieldKey, data, storeData, method) {
    switch (method) {
      case HexActionMethodType.PUT:
        return HexStoreDataHelper.putMapArray(fieldKey, data, storeData);
      case HexActionMethodType.DELETE:
        return HexStoreDataHelper.deleteMapArray(fieldKey, data, storeData);
      case HexActionMethodType.TOGGLE:
        return HexStoreDataHelper.toggleMapArray(fieldKey, data, storeData);
      case HexActionMethodType.POST:
        return HexStoreDataHelper.postMapArray(fieldKey, data, storeData);
    }

    return this.getUnsupportedMethodRes(fieldKey, method);
  },

  handleActionMapField:
  function(fieldKey, data, storeData, method, fieldTypeDef) {
    switch (method) {
      case HexActionMethodType.POST:
        return HexStoreDataHelper.postMapSingle(
          fieldKey, data, storeData, fieldTypeDef);
    }

    return this.getUnsupportedMethodRes(fieldKey, method);
  },

  handleActionDictMapped:
  function(keyId, data, storeData, method, fieldTypeDef, isAutoFix) {
    switch (method) {
      case HexActionMethodType.PUT:
      case HexActionMethodType.POST:
        return HexStoreDataHelper.putDictWithMapping(
          data, storeData, keyId, fieldTypeDef, isAutoFix);
    }

    return this.getUnsupportedMethodRes(keyId, method);
  },

  putMapArray: function(fieldKey, newValue, dataSet, isUnique) {
    var dataAry = HexStoreDataMgr.getMapField(dataSet, fieldKey);
    if (!checker.isArray(dataAry)) {
      return this.getErrorRes(
        fieldKey, dataAry, EboxUIFieldErrorType.NOT_ARRAY_ERROR);
    }

    if (isUnique != false) {
      if (checker.isInArray(newValue, dataAry)) {
        return this.getErrorRes(
          fieldKey, newValue, EboxUIFieldErrorType.ITEM_DUPLICATED_ERROR);
      }
    }

    dataAry.push(newValue);
    var updatedData = dataSet.set(fieldKey, Immutable.fromJS(dataAry));
    return this.getRes(updatedData);
  },

  postMapArray: function(fieldKey, newValue, dataSet, isUnique) {
    // overwrite array
    var dataAry = newValue;
    if (!checker.isArray(dataAry)) {
      return this.getErrorRes(
        fieldKey, dataAry, EboxUIFieldErrorType.NOT_ARRAY_ERROR);
    }

    var updatedData = dataSet.set(fieldKey, Immutable.fromJS(dataAry));
    return this.getRes(updatedData);
  },

  deleteMapArray: function(fieldKey, newValue, dataSet) {
    var dataAry = HexStoreDataMgr.getMapField(dataSet, fieldKey);
    if (!checker.isArray(dataAry)) {
      return this.getErrorRes(
        fieldKey, dataAry, EboxUIFieldErrorType.NOT_ARRAY_ERROR);
    }

    if (checker.isArray(newValue)) {
      return this.deleteMapArrayAry(fieldKey, newValue, dataAry, dataSet);
    } else {
      return this.deleteMapArraySingle(fieldKey, newValue, dataAry, dataSet);
    }
  },

  deleteMapArraySingle: function(fieldKey, newValue, dataAry, dataSet) {
    if (!checker.isInArray(newValue, dataAry)) {
      return this.getErrorRes(
        fieldKey, newValue, EboxUIFieldErrorType.ITEM_NOT_FOUND_ERROR);
    }

    util.removeFromAry(newValue, dataAry);
    var updatedData = dataSet.set(fieldKey, Immutable.fromJS(dataAry));
    return this.getRes(updatedData);
  },

  deleteMapArrayAry: function(fieldKey, newValueAry, dataAry, dataSet) {
    var itemCount = 0;
    for (var idx in newValueAry) {
      var newValue = newValueAry[idx];
      if (checker.isInArray(newValue, dataAry)) {
        util.removeFromAry(newValue, dataAry);
        itemCount++;
      }
    }

    if (itemCount <= 0) {
      return null;
    }

    var updatedData = dataSet.set(fieldKey, Immutable.fromJS(dataAry));
    return this.getRes(updatedData);
  },

  toggleMapArray: function(fieldKey, newValue, dataSet) {
    var dataAry = HexStoreDataMgr.getMapField(dataSet, fieldKey);
    if (!checker.isArray(dataAry)) {
      return this.getErrorRes(
        fieldKey, dataAry, EboxUIFieldErrorType.NOT_ARRAY_ERROR);
    }
    // Ensure immutable update
    dataAry = dataAry.slice(0);
    if (!checker.isInArray(newValue, dataAry)) {
      dataAry.push(newValue);
    } else {
      util.removeFromAry(newValue, dataAry);
    }

    var updatedData = dataSet.set(fieldKey, Immutable.fromJS(dataAry));
    return this.getRes(updatedData);
  },

  postMapSingle: function(fieldKey, newValue, dataSet, fieldTypeDef) {
    var newData = {};
    newData[fieldKey] = newValue;
    return this.postMap(newData, dataSet, fieldTypeDef);
  },

  postMap: function(newData, dataSet, fieldTypeDef) {
    var res = this.validatePostDataField(newData, null, fieldTypeDef);
    var validatedData = res.data;

    var curFieldType;
    var curFieldValue;
    for (var fieldType in fieldTypeDef) {
      curFieldType = fieldTypeDef[fieldType];
      curFieldValue = validatedData[curFieldType];
      if (checker.isSet(curFieldValue)) {
        dataSet = dataSet.set(curFieldType, curFieldValue);
      }
    }

    return this.getRes(dataSet, res.error);
  },

  putDictAry: function(newDataAry, dataSet, keyId, fieldTypeDef, isAutoFix) {
    var resData = dataSet;
    var ignoredDataAry = [];
    var stageData = null;
    var curNewData;
    for (var i = 0; i < newDataAry.length; i++) {
      curNewData = newDataAry[i];
      stageData = this.putDictSingle(
        curNewData, resData, keyId, fieldTypeDef, isAutoFix);
      if (stageData.data == null) {
        ignoredDataAry.push(this.getRes(curNewData, stageData.error));
      } else {
        // Update
        resData = stageData.data;
      }
    }

    if (ignoredDataAry.length == 0) {
      ignoredDataAry = null;
    }
    return this.getRes(resData, ignoredDataAry);
  },

  putDictSingle: function(
    newData, dataSet, keyId, fieldTypeDef, isAutoFix) {
    var res = this.validatePutDataField(
      newData, keyId, fieldTypeDef, isAutoFix);
    if (res.error == null) {
      var validatedData = res.data;
      res.data = dataSet.set(
        validatedData[keyId], Immutable.fromJS(validatedData));
    } else {
      res.data = null;
    }
    return res;
  },

  putDictWithMapping:
  function(newData, dataSet, keyId, fieldTypeDef, isAutoFix) {
    var mappedData = HexFieldMapper.mapDataKey(newData, fieldTypeDef);
    return this.putDict(mappedData, dataSet, keyId, fieldTypeDef, isAutoFix);
  },

  putDict: function(newData, dataSet, keyId, fieldTypeDef, isAutoFix) {
    if (checker.isArray(newData)) {
      return this.putDictAry(
        newData, dataSet, keyId, fieldTypeDef, isAutoFix);
    } else {
      return this.putDictSingle(
        newData, dataSet, keyId, fieldTypeDef, isAutoFix);
    }
  },

  postDictAry: function(newDataAry, dataSet, keyId, fieldTypeDef) {
    var resData = dataSet;
    var errorDataAry = [];
    var stageData = null;
    var curNewData;
    for (var i = 0; i < newDataAry.length; i++) {
      curNewData = newDataAry[i];
      stageData = this.postDictSingle(
        curNewData, resData, keyId, fieldTypeDef);
      if (stageData.data != null) {
        // Update
        resData = stageData.data;
      }

      if (stageData.error != null) {
        errorDataAry.push(this.getRes(curNewData, stageData.error));
      }

    }

    if (errorDataAry.length == 0) {
      errorDataAry = null;
    }

    return this.getRes(resData, errorDataAry);
  },

  postDictSingle: function(newData, dataSet, keyId, fieldTypeDef) {
    var res = this.validatePostDataField(newData, keyId, fieldTypeDef);
    var validatedData = res.data;
    var key = validatedData[keyId];
    if (checker.isSetNonNull(key)) {
      var oldData = dataSet.get(key);
      var updatedData = oldData.merge(Immutable.fromJS(validatedData));
      res.data = dataSet.set(key, updatedData);
    } else {
      res.data = null;
    }
    return res;
  },

  postDict: function(newData, dataSet, keyId, fieldTypeDef) {
    if (checker.isArray(newData)) {
      return this.postDictAry(
        newData, dataSet, keyId, fieldTypeDef);
    } else {
      return this.postDictSingle(
        newData, dataSet, keyId, fieldTypeDef);
    }
  },

  postDictWithMapping: function(newData, dataSet, keyId, fieldTypeDef) {
    var mappedData = HexFieldMapper.mapDataKey(newData, fieldTypeDef);
    return this.postDict(mappedData, dataSet, keyId, fieldTypeDef);
  },

  validatePutDataField: function(newData, keyId, fieldTypeDef, isAutoFix) {
    return HexFieldPropMgr.getValidateObjFull(
      newData, fieldTypeDef, isAutoFix, keyId);
  },

  validatePostDataField: function(newData, keyId, fieldTypeDef) {
    return HexFieldPropMgr.getValidateObj(newData, fieldTypeDef, keyId);
  },

  syncRemoteChangeToLocal: function(
    storeData, updateData, localFieldType, remoteFieldType, fieldTypeDef) {

    var storeRemote = HexStoreDataMgr.getMapField(storeData, remoteFieldType);
    var updateRemote = HexStoreDataMgr.getMapField(updateData, remoteFieldType);
    var localAry = HexStoreDataMgr.getMapField(updateData, localFieldType);
    var diffResAry = util.diffAry(storeRemote, updateRemote);

    var addItems = diffResAry.add;
    var deleteItems = diffResAry.delete;

    if (checker.isSetNonNull(addItems)) {
      addItems.map(function(newItem) {
        if (!checker.isInArray(newItem, localAry)) {
          localAry.push(newItem);
        }
      });
    }

    if (checker.isSetNonNull(deleteItems)) {
      deleteItems.map(function(newItem) {
        var idx = localAry.indexOf(newItem);
        if (idx != -1) {
          localAry.splice(idx, 1);
        }
      });
    }

    return this.handleActionMapField(localFieldType, localAry, updateData,
                                     HexActionMethodType.POST, fieldTypeDef);
  }

};

module.exports = HexStoreDataHelper;
