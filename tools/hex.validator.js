
var checker = require('./hex.checker');

var HexValidator = function() {};

HexValidator.prototype = Object.assign({}, HexValidator.prototype, {

  ensurePercent: function(percent) {
    if (!checker.isSet(percent)) {
      return 0;
    } else if (!checker.isNumeric(percent)) {
      return 0;
    } else if (percent < 0) {
      return 0;
    } else if (percent > 100) {
      return 100;
    }
    return percent;
  },

  ensureRange: function(minValue, maxValue, pValue) {
    if (!checker.isSet(pValue)) {
      return minValue;
    } else if (!checker.isNumeric(pValue)) {
      return minValue;
    } else if (pValue < minValue) {
      return minValue;
    } else if (pValue > maxValue) {
      return maxValue;
    }
    return pValue;
  },

  ensureNumber: function(pValue, defaultValue) {
    if (!checker.isSet(pValue)) {
      return defaultValue;
    } else if (!checker.isNumeric(pValue)) {
      return defaultValue;
    }
    return parseFloat(pValue);
  },

  ensureInt: function(pValue, defaultValue) {
    if (!checker.isSet(pValue)) {
      return defaultValue;
    } else if (!checker.isNumeric(pValue)) {
      return defaultValue;
    }
    return parseInt(pValue);
  },

  ensurePositive: function(pValue, defaultValue) {
    if (!checker.isSet(pValue)) {
      return defaultValue;
    } else if (!checker.isNumeric(pValue)) {
      return defaultValue;
    } else if (pValue < 0) {
      return defaultValue;
    }
    return pValue;
  },

  ensureBool: function(pValue, defaultValue) {
    if (!checker.isSet(pValue)) {
      return defaultValue;
    } if (pValue === 0) {
      return false;
    } if (pValue === 1) {
      return true;
    } if (pValue === 'false') {
      return false;
    } else if (pValue === 'true') {
      return true;
    } if (pValue !== true && pValue !== false) {
      return defaultValue;
    }
    return pValue;
  },

  ensureStr: function(pValue, defaultValue) {
    if (!checker.isSetNonNull(pValue)) {
      return defaultValue;
    }
    return pValue.toString();
  },

  ensureAry: function(pValue, defaultValue) {
    if (!checker.isArray(pValue)) {
      return defaultValue;
    }
    return pValue;
  },

  ensureImmutableJS: function(pValue, defaultValue) {
    if (!checker.isSetNonNull(pValue)) {
      return defaultValue;
    } else if (pValue.toJS) {
      return pValue.toJS();
    }
    return pValue;
  },

  ensureObject: function(pValue, defaultValue) {
    if (!checker.isObj(pValue)) {
      return defaultValue;
    }
    return pValue;
  },

  ensureJsonParsed: function(pValue, defaultValue) {
    if (checker.isObj(pValue)) {
      return pValue;
    } else if (checker.isStr(pValue)) {
      try {
        var data = JSON.parse(pValue);
        return data;
      } catch (e) {
      }
    }
    return defaultValue;
  },

  ensureIsSet: function(pValue, defaultValue) {
    if (!checker.isSet(pValue)) {
      return defaultValue;
    }
    return pValue;
  },

  ensureIsSetNonNull: function(pValue, defaultValue) {
    if (!checker.isSetNonNull(pValue)) {
      return defaultValue;
    }
    return pValue;
  },

  ensureCollection: function(enumObj, pValue, defaultValue) {
    if (!checker.isSet(pValue) || !checker.isSet(enumObj)) {
      return defaultValue;
    }
    var isFound = false;

    if (Object.prototype.toString.call(enumObj) === '[object Array]') {
      for (var key in enumObj) {
        if (key == pValue) {
          isFound = true;
          break;
        }
      }
    } else {
      for (var key in enumObj) {
        if (enumObj[key] === pValue) {
          isFound = true;
          break;
        }
      }
    }

    if (isFound) {
      return pValue;
    }
    return defaultValue;
  }
});

module.exports = exports = new HexValidator();
