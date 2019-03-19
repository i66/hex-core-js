var ErrorType = require('../types/hex.field.error.type');
var FileManager = require('./hex.file.mgr.factory').getInstance();
var HexPathMgr = require('./hex.path.mgr.factory').getInstance();
var HexBaseValidatorType = require('../types/hex.base.validator.type');
var HexPrimitiveType = require('../types/hex.primitive.type');

var checker = require('../../core/tools/hex.checker');
var util = require('../../core/tools/hex.util');

function Validate(decorator) {
  this.decorator = decorator;
}

Validate.prototype.validate = function(value) {
  var error = this.tryValidate(value);
  if (error != null) {
    return error;
  } else {
    if (this.decorator) {
      return this.decorator.validate(value);
    }
  }
};

Validate.prototype.generate = function(value) {
  if (this.tryValidate(value) != null) {
    value = this.tryGenerate(value);
  }

  if (this.decorator) {
    return this.decorator.generate(value);
  } else {
    return value;
  }
};

Validate.prototype.tryValidate = function(value) {
  return {
    type: ErrorType.UNKNOWN_ERROR
  };
};

Validate.prototype.tryGenerate = function(value) {
  return null;
};

Validate.prototype.getType = function() {
  return HexBaseValidatorType.BASE;
};

var EmptyValidator = function(decorator, param) {
  Validate.call(this, decorator);
};
EmptyValidator.prototype = Object.assign({}, Validate.prototype);
EmptyValidator.prototype.tryValidate = function(value) {
  //console.log('EmptyValidator - Validate! - ' + value);
  if (!value || (
    (typeof(value) == 'object' || typeof(value) == 'string') &&
    (value.length === 0 || Object.keys(value).length === 0))
  ) {
    return {
      type: ErrorType.EMPTY_ERROR
    };
  }
  return null;
};
EmptyValidator.prototype.getType = function() {
  return HexBaseValidatorType.NON_EMPTY;
};

// Primitive Types
// String
var StringValidator = function(decorator, param) {
  Validate.call(this, decorator);
};

StringValidator.prototype = Object.assign({}, Validate.prototype);
StringValidator.prototype.tryValidate = function(value) {
  if (!checker.isStr(value)) {
    return {
      type: ErrorType.NOT_STRING_ERROR
    };
  }
  return null;
};
StringValidator.prototype.getType = function() {
  return HexPrimitiveType.STRING;
};

// Int
var IntValidator = function(decorator, param) {
  Validate.call(this, decorator);
};
IntValidator.prototype = Object.assign({}, Validate.prototype);
IntValidator.prototype.tryValidate = function(value) {
  if (!checker.isInt(value)) {
    return {
      type: ErrorType.NOT_INT_ERROR
    };
  }
  return null;
};
IntValidator.prototype.getType = function() {
  return HexPrimitiveType.INTEGER;
};

// Float
var FloatValidator = function(decorator, param) {
  Validate.call(this, decorator);
};
FloatValidator.prototype = Object.assign({}, Validate.prototype);
FloatValidator.prototype.tryValidate = function(value) {
  if (!checker.isFloat(value)) {
    return {
      type: ErrorType.NOT_FLOAT_ERROR
    };
  }
  return null;
};
FloatValidator.prototype.getType = function() {
  return HexPrimitiveType.FLOAT;
};

// Bool
var BoolValidator = function(decorator, param) {
  Validate.call(this, decorator);
};
BoolValidator.prototype = Object.assign({}, Validate.prototype);
BoolValidator.prototype.tryValidate = function(value) {
  if (!checker.isBool(value)) {
    return {
      type: ErrorType.NOT_BOOL_ERROR
    };
  }
  return null;
};
BoolValidator.prototype.getType = function() {
  return HexPrimitiveType.BOOLEAN;
};

// Positive Integer
var PositiveIntValidator = function(decorator, param) {
  Validate.call(this, decorator);
};
PositiveIntValidator.prototype = Object.assign({}, Validate.prototype);
PositiveIntValidator.prototype.tryValidate = function(value) {
  if (!checker.isPositiveInt(value)) {
    return {
      type: ErrorType.NOT_POSITIVE_INT_ERROR
    };
  }
  return null;
};
PositiveIntValidator.prototype.getType = function() {
  return HexPrimitiveType.POSITIVE_INTEGER;
};

// Positive Float
var PositiveFloatValidator = function(decorator, param) {
  Validate.call(this, decorator);
};
PositiveFloatValidator.prototype = Object.assign({}, Validate.prototype);
PositiveFloatValidator.prototype.tryValidate = function(value) {
  if (!checker.isPositiveFloat(value)) {
    return {
      type: ErrorType.NOT_POSITIVE_FLOAT_ERROR
    };
  }
  return null;
};
PositiveFloatValidator.prototype.getType = function() {
  return HexPrimitiveType.POSITIVE_FLOAT;
};

// Array
var ArrayValidator = function(decorator, param) {
  Validate.call(this, decorator);
};
ArrayValidator.prototype = Object.assign({}, Validate.prototype);
ArrayValidator.prototype.tryValidate = function(value) {
  if (!checker.isArray(value)) {
    return {
      type: ErrorType.NOT_ARRAY_ERROR
    };
  }
  return null;
};
ArrayValidator.prototype.getType = function() {
  return HexPrimitiveType.ARRAY;
};

// Object
var ObjectValidator = function(decorator, param) {
  Validate.call(this, decorator);
};
ObjectValidator.prototype = Object.assign({}, Validate.prototype);
ObjectValidator.prototype.tryValidate = function(value) {
  if (!checker.isObj(value)) {
    return {
      type: ErrorType.NOT_OBJECT_ERROR
    };
  }
  return null;
};
ObjectValidator.prototype.getType = function() {
  return HexPrimitiveType.OBJECT;
};

// General Validators
var LengthValidator = function(decorator, param) {
  Validate.call(this, decorator);
  this.verifyLength = param;
};

LengthValidator.prototype = Object.assign({}, Validate.prototype);
LengthValidator.prototype.tryValidate = function(value) {
  //console.log('LengthValidator - Validate! - ' + value);
  if (value && value.hasOwnProperty('length') &&
    value.length > this.verifyLength) {
    return {
      type: ErrorType.LENGTH_OVERFLOW_ERROR,
      msgArg: [this.verifyLength]
    };
  }
  return null;
};
LengthValidator.prototype.getType = function() {
  return HexBaseValidatorType.LENGTH;
};

var EmailValidator = function(decorator, param) {
  Validate.call(this, decorator);
};

EmailValidator.prototype = Object.assign({}, Validate.prototype);
var emailRegex =
  /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
EmailValidator.prototype.tryValidate = function(value) {
  //console.log('EmailValidator - Validate! - ' + value);
  if (!emailRegex.test(value)) {
    return {
      type: ErrorType.INVALID_EMAIL_ERROR
    };
  }
  return null;
};
EmailValidator.prototype.getType = function() {
  return HexBaseValidatorType.EMAIL;
};

var EngNumOnlyValidator = function(decorator, param) {
  Validate.call(this, decorator);
};

EngNumOnlyValidator.prototype = Object.assign({}, Validate.prototype);
var engNumRegex = /^[a-zA-Z0-9][A-Za-z0-9_-]*$/;
EngNumOnlyValidator.prototype.tryValidate = function(value) {
  //console.log('EngNumOnlyValidator - Validate! - ' + value);
  if (!engNumRegex.test(value)) {
    return {
      type: ErrorType.INVALID_ENG_NUM_ERROR
    };
  }
  return null;
};
EngNumOnlyValidator.prototype.getType = function() {
  return HexBaseValidatorType.ENG_NUM;
};

var FileExistValidator = function(decorator, param) {
  Validate.call(this, decorator);
  this.isUseRelatedPath = param;
};
FileExistValidator.prototype = Object.assign({}, Validate.prototype);
FileExistValidator.prototype.tryValidate = function(value) {
  //console.log('FileExistValidator - Validate! - ' + value);
  if (this.isUseRelatedPath != true) {
    if (FileManager.getFileNameFromPath(value) == value) {
      value = FileManager.joinPath([HexPathMgr.getWorkspacePath(), value]);
    }
  }

  if (!FileManager.isFile(value)) {
    return {
      type: ErrorType.FILE_NOT_EXIST_ERROR
    };
  }
  return null;
};
FileExistValidator.prototype.getType = function() {
  return HexBaseValidatorType.FILE_EXIST;
};

var _validatorMap = {};
_validatorMap[HexBaseValidatorType.NON_EMPTY] = EmptyValidator;
_validatorMap[HexBaseValidatorType.LENGTH] = LengthValidator;
_validatorMap[HexBaseValidatorType.ENG_NUM] = EngNumOnlyValidator;
_validatorMap[HexBaseValidatorType.FILE_EXIST] = FileExistValidator;
_validatorMap[HexBaseValidatorType.EMAIL] = EmailValidator;

_validatorMap[HexPrimitiveType.STRING] = StringValidator;
_validatorMap[HexPrimitiveType.INTEGER] = IntValidator;
_validatorMap[HexPrimitiveType.FLOAT] = FloatValidator;
_validatorMap[HexPrimitiveType.BOOLEAN] = BoolValidator;
_validatorMap[HexPrimitiveType.POSITIVE_INTEGER] = PositiveIntValidator;
_validatorMap[HexPrimitiveType.POSITIVE_FLOAT] = PositiveFloatValidator;
_validatorMap[HexPrimitiveType.ARRAY] = ArrayValidator;
_validatorMap[HexPrimitiveType.OBJECT] = ObjectValidator;

function getValidatorConstructor(type) {
  var validator = _validatorMap[type];
  if (checker.isSetNonNull(validator)) {
    return validator;
  }
  return null;
}

module.exports.Validate = Validate;

module.exports.EmptyValidator = EmptyValidator;
module.exports.StringValidator = StringValidator;
module.exports.LengthValidator = LengthValidator;
module.exports.EmailValidator = EmailValidator;
module.exports.EngNumOnlyValidator = EngNumOnlyValidator;
module.exports.FileExistValidator = FileExistValidator;
module.exports.getConstructor = getValidatorConstructor;
