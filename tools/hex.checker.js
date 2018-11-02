var HexChecker = function() {};
HexChecker.prototype = Object.assign({}, HexChecker.prototype, {
  isNull: function(whichever) {
    return whichever === undefined || whichever === null;
  },

  isFiniteNumber: function(whichever) {
    return isFinite(String(whichever).trim() || NaN);
  },

  isNumeric: function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  },

  isFloat: function(n) {
    return typeof n === 'number' && isFinite(n);
  },

  isBool: function(n) {
    return typeof(n) === 'boolean';
  },

  isPositiveFloat: function(n) {
    return this.isFloat(n) && n >= 0;
  },

  isInt: function(n) {
    return typeof n === 'number' &&  isFinite(n) &&
          (parseFloat(n) === parseInt(n));
  },

  isPositiveInt: function(n) {
    return this.isInt(n) && n >= 0;
  },

  isStr: function(n) {
    return typeof n === 'string';
  },

  isObj: function(n) {
    return n != null && !this.isArray(n) && typeof n === 'object';
  },

  isStrInLength: function(n, length) {
    return this.isStr(n) && this.isPositiveFloat(length) && n.length < length;
  },

  isNonEmptyStr: function(n) {
    return this.isStr(n) && n.trim() != '';
  },

  isEmptyStr: function(n) {
    return !this.isNonEmptyStr(n);
  },

  isInRange: function(num, min, max) {
    // Swap if needed
    if (min > max) {
      var tmp = min;
      min = max;
      max = tmp;
    }
    if (!this.isNumeric(num) || !this.isNumeric(min) || !this.isNumeric(max)) {
      return false;
    }

    num = parseFloat(num);
    min = parseFloat(min);
    max = parseFloat(max);

    return num >= min && num <= max;
  },

  isPositiveInt: function(n) {
    return this.isInt(n) && parseInt(n) >= 0;
  },

  isSet: function(obj) {
    return typeof obj != 'undefined';
  },

  isSetMulti: function(obj) {
    for (var i = 0; i < arguments.length; i++) {
      if (!this.isSet(arguments[i])) {
        return false;
      }
    }
    return true;
  },

  isSetNonNullMulti: function(obj) {
    for (var i = 0; i < arguments.length; i++) {
      if (!this.isSetNonNull(arguments[i])) {
        return false;
      }
    }
    return true;
  },

  isSetNonNullMultiAry: function(objAry) {
    for (var i = 0; i < objAry.length; i++) {
      if (!this.isSetNonNull(objAry[i])) {
        return false;
      }
    }
    return true;
  },

  isSetNonNull: function(obj) {
    return typeof obj != 'undefined' && obj != null;
  },

  isFunction: function(functionToCheck) {
    var getType = {};
    return functionToCheck &&
           getType.toString.call(functionToCheck) === '[object Function]';
  },

  isArray: function(ary) {
    var getType = {};
    return ary && getType.toString.call(ary) === '[object Array]';
  },

  isInArray: function(obj, ary) {
    return ary.indexOf(obj) != -1;
  },

  isInCollection: function(pValue, enumObj) {
    if (!this.isSet(pValue) || !this.isSet(enumObj)) {
      return false;
    }
    var isFound = false;

    for (var key in enumObj) {
      if (enumObj[key] === pValue) {
        return true;
      }
    }

    return false;
  },

  isInObjArray: function(pKey, pValue, aryObj) {
    if (!this.isSet(pKey) || !this.isArray(aryObj)) {
      return null;
    }

    for (var i = 0; i < aryObj.length; i++) {
      if (aryObj[i][pKey] == pValue) {
        return i;
      }
    }
    return -1;
  },

  isEmptyObj: function(obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }

    return true && JSON.stringify(obj) === JSON.stringify({});
  },

  isEqual: function(objA, objB) {
    var a = JSON.stringify(objA);
    var b = JSON.stringify(objB);
    return a === b;
  },

  isWeb: function() {
    return this.isSetNonNull(global.isWeb) && global.isWeb == true;
  },

  isSsl: function() {
    return location.protocol === 'https:';
  },

  isMobile: function() {
    return this.isSetNonNull(global.isMobile) && global.isMobile == true;
  },

  isPc: function() {
    return !this.isWeb() && !this.isMobile();
  }

});

module.exports = exports = new HexChecker();
