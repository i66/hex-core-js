var HexPrimitiveType = require('../types/hex.primitive.type');
var HexFieldTypeMgr = require('./hex.field-type.mgr');
var HexValidatorMgr = require('./hex.validator.mgr');
var checker = require('../../core/tools/hex.checker');
var util = require('../../core/tools/hex.util');
var validType = require('../types/hex.base.validator.type');
var HexPrimitiveType = require('../types/hex.primitive.type');
var HexFieldErrorType = require('../types/hex.field.error.type');

var _validateStr32 = HexValidatorMgr.get(
    validType.NON_EMPTY, HexPrimitiveType.STRING, [validType.LENGTH, 32]);

var _validateStr128 = HexValidatorMgr.get(
    validType.NON_EMPTY, HexPrimitiveType.STRING, [validType.LENGTH, 128]);

var _validateEmail = HexValidatorMgr.get(
    validType.NON_EMPTY, HexPrimitiveType.STRING, validType.EMAIL);

var _validateNonEmptyStr = HexValidatorMgr.get(
    validType.NON_EMPTY, HexPrimitiveType.STRING);

var _validateNonEmpty = HexValidatorMgr.get(validType.NON_EMPTY);

var _validateEngNum32 = HexValidatorMgr.get(
    validType.NON_EMPTY, [validType.LENGTH, 32], validType.ENG_NUM);

var _validateFileExist = HexValidatorMgr.get(
    validType.NON_EMPTY, validType.FILE_EXIST);

var _optionalMap = {};

var HexFieldPropMgr = {

  set: function(fieldKey, fieldType, validator, defaultVal, isOptional) {
    HexFieldTypeMgr.set(fieldKey, fieldType, defaultVal);
    HexValidatorMgr.setValidator(fieldKey, validator);
    this.setIsOptional(fieldKey, isOptional);
  },

  setIsOptional: function(keyId, isOptional) {
    if (isOptional === true) {
      _optionalMap[keyId] = true;
    }
  },

  isOptional: function(keyId) {
    return _optionalMap[keyId] == true;
  },

  setFieldObjType: function(fieldKey, fieldType) {
    HexValidatorMgr.setObjType(fieldKey, fieldType);
  },

  setFieldRefType: function(fieldKey, fieldType) {
    HexValidatorMgr.setRefType(fieldKey, fieldType);
  },

  getValidator: function(fieldKey) {
    return HexValidatorMgr.getValidator(fieldKey);
  },

  getFieldObjType: function(fieldKey) {
    return HexValidatorMgr.getObjType(fieldKey);
  },

  getFieldRefType: function(fieldKey) {
    return HexValidatorMgr.getRefType(fieldKey);
  },

  getValidate: function(fieldKey, fieldValue) {
    // check optional
    if (fieldValue === undefined && this.isOptional(fieldKey)) {
      return null;
    }

    // If custom validator is set, use it
    if (HexValidatorMgr.isValidatorSet(fieldKey)) {
      return HexValidatorMgr.getValidate(fieldKey, fieldValue, false);
    }
    // If not, use primitive type validation
    var primitiveType = this.getType(fieldKey);
    // No Type can be used
    if (primitiveType == null) {
      console.log('Validator Not Found:' + fieldKey);
      return null;
    }
    return HexValidatorMgr.getValidate(primitiveType, fieldValue, false);
  },

  getValidateObjFull: function(newData, fieldTypeDef, isAutoFix, keyId) {
    var fieldErrorMap = {};
    var validatedData = {};
    var curFieldType;
    var curFieldValue;
    var res;
    var fieldRes;
    for (var fieldType in fieldTypeDef) {
      curFieldType = fieldTypeDef[fieldType];
      curFieldValue = newData[curFieldType];
      res = this.getValidate(curFieldType, curFieldValue);
      if (res != null) {
        if (isAutoFix === true && curFieldType != keyId) {
          var defaultVal = this.getDefault(curFieldType);
          if (checker.isSet(defaultVal)) {
            validatedData[curFieldType] = defaultVal;
          } else {
            fieldErrorMap[curFieldType] = {
              value: curFieldValue,
              error: res
            };
          }
        } else {
          fieldErrorMap[curFieldType] = {
            value: curFieldValue,
            error: res
          };
        }
      } else {
        // Validate ObjType and RefType
        var isPass = true;
        if (HexValidatorMgr.isObjTypeSet(curFieldType)) {
          var objTypeDef = HexValidatorMgr.getObjType(curFieldType);
          fieldRes = this.getValidateObjFull(curFieldValue, objTypeDef);
          if (fieldRes.error != null) {
            fieldErrorMap[curFieldType] = {
              value: curFieldValue,
              error: fieldRes.error
            };
            isPass = false;
          }
        } else if (HexValidatorMgr.isRefTypeSet(curFieldType)) {
          var refTypeDef = HexValidatorMgr.getRefType(curFieldType);
          fieldRes = this.getValidateRef(curFieldValue, refTypeDef);
          if (fieldRes != null) {
            fieldErrorMap[curFieldType] = {
              value: curFieldValue,
              error: fieldRes
            };
            isPass = false;
          }
        }
        if (isPass == true && checker.isSet(curFieldValue)) {
          validatedData[curFieldType] = curFieldValue;
        }
      }
    }

    if (checker.isEmptyObj(fieldErrorMap)) {
      fieldErrorMap = null;
    }

    return {
      data: validatedData,
      error: fieldErrorMap
    };
  },

  getValidateRef: function(newData, refTypeDef) {
    var validatedData = null;
    var res = null;
    if (!checker.isInCollection(newData, refTypeDef)) {
      res = HexFieldErrorType.INVALID_REF_TYPE_ERROR;
    }
    return res;
  },

  getValidateObj: function(newData, fieldTypeDef, keyId) {
    var fieldErrorMap = {};
    var curFieldType;
    var res;
    var filteredData = {};
    for (var fieldType in fieldTypeDef) {
      curFieldType = fieldTypeDef[fieldType];
      // Only check available field, but keyId have to be exists and valid
      if (curFieldType != keyId && !checker.isSet(newData[curFieldType])) {
        continue;
      }

      res = this.getValidate(
        curFieldType, newData[curFieldType]);
      if (res != null) {
        fieldErrorMap[curFieldType] = {
          value: newData[curFieldType],
          error: res
        };
      } else {
        filteredData[curFieldType] = newData[curFieldType];
      }
    }

    if (checker.isEmptyObj(fieldErrorMap)) {
      fieldErrorMap = null;
    }

    return {
      data: filteredData,
      error: fieldErrorMap
    };
  },

  getType: function(fieldKey) {
    return HexFieldTypeMgr.getType(fieldKey);
  },

  getDefault: function(fieldKey) {
    return HexFieldTypeMgr.getDefault(fieldKey);
  },

  getProp: function(data, fieldKey) {
    return util.getProp(data, fieldKey, HexFieldTypeMgr.getDefault(fieldKey));
  },

  validateStr32: _validateStr32,
  validateStr128: _validateStr128,
  validateEmail: _validateEmail,
  validateNonEmpty: _validateNonEmpty,
  validateNonEmptyStr: _validateNonEmptyStr,
  validateEngNum32: _validateEngNum32,
  validateFileExist: _validateFileExist,

};

// Set Primitive Validator
for (var pType in HexPrimitiveType) {
  HexValidatorMgr.setValidator(
    pType, HexValidatorMgr.get(pType));
}

module.exports = HexFieldPropMgr;
