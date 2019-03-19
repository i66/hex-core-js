
var HexBaseValidator = require('./hex.base.validator');
var HexBaseValidatorType = require('../types/hex.base.validator.type');
var L10N = require('../types/hex.l10n.type');
var ErrorType = require('../types/hex.field.error.type');
var checker = require('../../core/tools/hex.checker');

var errorMapL10N = {};
errorMapL10N[ErrorType.EMPTY_ERROR] = L10N.EMPTY_ERROR_MSG;
errorMapL10N[ErrorType.NOT_STRING_ERROR] = L10N.NOT_STRING_ERROR_MSG;
errorMapL10N[ErrorType.LENGTH_OVERFLOW_ERROR] = L10N.LENGTH_OVERFLOW_ERROR_MSG;
errorMapL10N[ErrorType.INVALID_EMAIL_ERROR] = L10N.INVALID_EMAIL_ERROR_MSG;
errorMapL10N[ErrorType.INVALID_ENG_NUM_ERROR] = L10N.INVALID_ENG_NUM_ERROR_MSG;
errorMapL10N[ErrorType.UNKNOWN_ERROR] = L10N.UNKNOWN_ERROR_MSG;
errorMapL10N[ErrorType.FILE_NOT_EXIST_ERROR] = L10N.FILE_NOT_EXIST_ERROR_MSG;

function getValidatorInstance(typeInfo, chainedValidator) {
  var validatorType;
  var validatorParam;

  if (checker.isArray(typeInfo)) {
    validatorType = typeInfo[0];
    validatorParam = typeInfo[1];
  }else {
    validatorType = typeInfo;
  }

  var ValidatorCon = HexBaseValidator.getConstructor(validatorType);
  if (ValidatorCon != null) {
    return new ValidatorCon(chainedValidator, validatorParam);
  }else {
    // return original
    return chainedValidator;
  }
}

function checkGetMap(key, map) {
  var res = map[key];
  if (checker.isSet(res)) {
    return res;
  }
  return null;
}

var _validatorMap = {};
var _objTypeMap = {};
var _refTypeMap = {};

var HexValidatorMgr = {
  reset: function() {
    _validatorMap = {};
  },
  // [type, param], [type, param]...
  get: function() {
    var args = Array.prototype.slice.call(arguments, 0);
    return this.getFromAry(args);
  },

  getFromAry: function(args) {
    var chainedValidator;
    for (var i = args.length - 1; i >= 0; i--) {
      chainedValidator = getValidatorInstance(args[i], chainedValidator);
    }

    return chainedValidator;
  },

  getValidator: function(keyId) {
    return checkGetMap(keyId, _validatorMap);
  },

  set: function() {
    var keyId = arguments[0];
    var args = Array.prototype.slice.call(arguments, 0);

    if (!checker.isStr(keyId)) {
      return null;
    }
    var validator = this.getFromAry(args);
    return this.setValidator(keyId, validator);

  },

  setValidator: function(keyId, validator) {
    if (!checker.isSetNonNull(validator)) {
      return null;
    }
    _validatorMap[keyId] = validator;
    return validator;
  },

  isValidatorSet: function(keyId) {
    return checker.isSetNonNull(_validatorMap[keyId]);
  },

  setObjType: function(keyId, fieldType) {
    if (!checker.isSetNonNull(fieldType)) {
      return null;
    }
    _objTypeMap[keyId] = fieldType;
    return fieldType;
  },

  isObjTypeSet: function(keyId) {
    return checker.isSetNonNull(_objTypeMap[keyId]);
  },

  getObjType: function(keyId) {
    return checkGetMap(keyId, _objTypeMap);
  },

  setRefType: function(keyId, fieldType) {
    if (!checker.isSetNonNull(fieldType)) {
      return null;
    }
    _refTypeMap[keyId] = fieldType;
    return fieldType;
  },

  isRefTypeSet: function(keyId) {
    return checker.isSetNonNull(_refTypeMap[keyId]);
  },

  getRefType: function(keyId) {
    return checkGetMap(keyId, _refTypeMap);
  },

  getValidate: function(keyId, content, isUseFieldError) {
    //console.log('Validator:' + keyId + ', Value:' + content);
    var validator = _validatorMap[keyId];
    if (!checker.isSetNonNull(validator)) {
      console.log('Validator not found:' + keyId);
    }
    return this.validateField(validator, content, isUseFieldError);
  },

  getValidateMsg: function(keyId, content, isUseFieldError) {
    return this.getValidate(keyId, content, true);
  },

  // [id, [type, param], [type, param]...], [id, [type, param]...]
  getValidatorMap: function() {
    var args = Array.prototype.slice.call(arguments, 0);
    return this.getValidatorMapFromAry(args);
  },

  getValidatorMapFromAry: function(mapAry) {
    var mapHash = {};
    var curMap;
    var curKey;
    for (var i = 0; i < mapAry.length; i++) {
      curMap = mapAry[i];
      curKey = curMap[0];
      curMap.splice(0, 1);
      mapHash[curKey] = this.getFromAry(curMap);
    }

    return mapHash;
  },

  getInputErrorMsg: function(error) {
    return InputError(error);
  },

  getFieldErrorMsg: function(error) {
    if (checker.isSetNonNull(error) && checker.isSet(error.type)) {
      var msgArg = error.hasOwnProperty('msgArg') ? error.msgArg : undefined;
      return {
        type: error.type,
        msg: errorMapL10N[error.type],
        msgArg: msgArg
      };
    }
    return null;
  },

  validateField: function(validator, content, isUseFieldError) {
    if (checker.isSet(validator)) {
      var errMsg = validator.validate(content);
      if (isUseFieldError == true) {
        return this.getFieldErrorMsg(errMsg);
      }else {
        if (checker.isSetNonNull(errMsg)) {
          return errMsg;
        }
      }
    }
    return null;

  },

  validate: function(validatorMap, content, isUseFieldError) {
    var result = {};
    var errMsg;
    for (var key in validatorMap) {
      if (checker.isSet(content[key])) {
        errMsg = this.validateField(
          validatorMap[key], content[key], isUseFieldError);
        if (checker.isSet(errMsg)) {
          result[key] = errMsg;
        } else {
          result[key] = null;
        }
      }
    }
    return result;
  }
};

module.exports = HexValidatorMgr;
