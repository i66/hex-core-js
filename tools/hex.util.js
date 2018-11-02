var checker = require('./hex.checker');
var format = require('./hex.format');

var HexUtil = function() {};

HexUtil.prototype = Object.assign({}, HexUtil.prototype, {
  sortAryByProp: function(ary, prop, isDesc) {
    if (ary.length == 0) {
      return ary;
    }
    var testProp = ary[0][prop];
    if (checker.isStr(testProp)) {
      return this.sortAryByPropStr(ary, prop, isDesc);
    }

    return this.sortAryByPropNum(ary, prop, isDesc);

  },
  sortAryByPropNum: function(ary, prop, isDesc) {
    if (isDesc == true) {
      return ary.sort(function(a, b) {
        var propA = a[prop];
        var propB = b[prop];
        if (propA < propB) {
          return 1;
        } else if (propA > propB) {
          return -1;
        }
        return 0;
      });
    }
    return ary.sort(function(a, b) {
      var propA = a[prop];
      var propB = b[prop];
      if (propA > propB) {
        return 1;
      } else if (propA < propB) {
        return -1;
      }
      return 0;
    });
  },
  sortAryByPropStr: function(ary, prop, isDesc) {
    var collator = new Intl.Collator(
        undefined, {numeric: true, sensitivity: 'base'});
    if (isDesc == true) {
      return ary.sort(function(a, b) {
        var propA = a[prop];
        var propB = b[prop];
        return collator.compare(propB, propA);
      });
    }
    return ary.sort(function(a, b) {
      var propA = a[prop];
      var propB = b[prop];
      return collator.compare(propA, propB);
    });
  },

  removeFromAry: function(obj, ary) {
    if (!checker.isArray(ary)) {
      return null;
    }

    var idx = ary.indexOf(obj);
    if (idx != -1) {
      ary.splice(idx, 1);
    }
    return ary;
  },

  cleanAry: function(deleteValue, ary) {
    if (!checker.isArray(ary)) {
      return null;
    }
    for (var i = 0; i < ary.length; i++) {
      if (ary[i] == deleteValue) {
        ary.splice(i, 1);
        i--;
      }
    }
    return ary;
  },

  diffAry: function(curAry, newAry) {
    return {
      add: this.subAry(curAry, newAry),
      delete: this.subAry(newAry, curAry)
    };
  },

  subAry: function(lhsAry, rhsAry) {
    if (!(checker.isArray(lhsAry) && checker.isArray(rhsAry))) {
      return null;
    }

    var diffAry = [];
    rhsAry.map(function(item) {
      if (!checker.isInArray(item, lhsAry)) {
        diffAry.push(item);
      }
    });
    return diffAry;
  },

  isArraysEqual: function(aryA, aryB, isOrdered) {
    if (aryA === aryB) {
      return true;
    }
    if (aryA == null || aryB == null) {
      return false;
    }
    if (aryA.length != aryB.length) {
      return false;
    }
    if (isOrdered != true) {
      aryA.sort();
      aryB.sort();
    }

    for (var i = 0; i < aryA.length; i++) {
      if (aryA[i] !== aryB[i]) {
        return false;
      }
    }
    return true;
  },

  isArraysSubset: function(sourceAry, targetAry) {
    for (var i = 0; i < targetAry.length; i++) {
      if (sourceAry.indexOf(targetAry[i]) == -1) {
        return false;
      }
    }
    return true;
  },

  uniqueAry: function(ary) {
    var resAry = ary.concat();
    for (var i = 0; i < resAry.length; ++i) {
      for (var j = i + 1; j < resAry.length; ++j) {
        if (resAry[i] === resAry[j]) {
          resAry.splice(j--, 1);
        }
      }
    }
    return resAry;
  },

  splitLineAry: function(data) {
    return data.split(/\r?\n/g);
  },

  getAbsoutePosition: function(element) {
    if (!checker.isSetNonNull(element) ||
        !checker.isSetNonNull(element.offsetTop)) {
      return {top: 0, left: 0};
    }
    var top = 0;
    var left = 0;
    do {
      top += element.offsetTop  || 0;
      left += element.offsetLeft || 0;
      element = element.offsetParent;
    } while (element);

    return {
      top: top,
      left: left
    };
  },

  getRandomInt: function(min, max) {
    if (!checker.isSetNonNull(min) || !checker.isSetNonNull(max)) {
      return null;
    }
    // Auto reverse
    if (max < min) {
      var tmp = max;
      max = min;
      min = tmp;
    }
    return Math.floor(Math.random() * (max - min)) + min;
  },

  getRandomFloat: function(min, max) {
    if (!checker.isSetNonNull(min) || !checker.isSetNonNull(max)) {
      return null;
    }
    // Auto reverse
    if (max < min) {
      var tmp = max;
      max = min;
      min = tmp;
    }
    return Math.random() * (max - min) + min;
  },

  getRandomFloatAry: function(min, max, total) {
    var resAry = [];
    for (var i = 0; i < total; i++) {
      resAry.push(this.getRandomFloat(min, max).toFixed(2));
    }
    return resAry;
  },

  getRandomUrlParam: function(length) {
    return '?' + this.getRandomString(5) + '=' + this.getRandomString(length);
  },

  getRandomString: function(length) {
    if (!checker.isNumeric(length) || length < 0) {
      return '';
    }

    var text = '';
    var possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  },

  hasClass: function(el, className) {
    if (!checker.isSetNonNull(el) ||
        !checker.isSetNonNull(el.className) ||
        !checker.isSetNonNull(className)) {
      return false;
    }
    className = format.toPlainString(className);

    if (el.classList) {
      return el.classList.contains(className);
    } else {
      return !!el.className.match(new RegExp('(\\s|^)' +
                                             className + '(\\s|$)'));
    }
  },

  addClass: function(el, className) {
    if (!checker.isSetNonNull(el) ||
        !checker.isSetNonNull(el.className) ||
        !checker.isSetNonNull(className)) {
      return false;
    }
    className = format.toPlainString(className);

    if (el.classList) {
      el.classList.add(className);
    } else if (!hasClass(el, className)) {
      el.className += ' ' + className;
    }
  },

  removeClass: function(el, className) {
    if (!checker.isSetNonNull(el) ||
        !checker.isSetNonNull(el.className) ||
        !checker.isSetNonNull(className)) {
      return false;
    }
    className = format.toPlainString(className);

    if (el.classList) {
      el.classList.remove(className);
    } else if (hasClass(el, className)) {
      var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
      el.className = el.className.replace(reg, ' ');
    }
  },

  getAllCssImgUrl: function() {
    var preloadImgUrl = [];
    for (var sheeti = 0; sheeti < document.styleSheets.length; sheeti++) {
      var sheet = document.styleSheets[sheeti];
      var rules = ('cssRules' in sheet) ? sheet.cssRules : sheet.rules;
      var posStart = -1;
      var posEnd = -1;
      var url = '';

      for (var rulei = 0; rulei < rules.length; rulei++) {
        var rule = rules[rulei];
        if ('cssText' in rule) {
          posStart = rule.cssText.indexOf('url(');
          if (posStart > -1) {
            posEnd = rule.cssText.indexOf(');', posStart);
            if (posEnd > -1) {
              url = rule.cssText.substring(posStart + 4, posEnd);
              url = url.replace(/['"]+/g, '');
              //console.log(rule.cssText);
              //console.log(url);
              if (preloadImgUrl.indexOf(url) == -1) {
                preloadImgUrl.push(url);
              }
            }
          }
        }
      }
    }
    return preloadImgUrl;
  },

  insertCssNode: function(css) {
    if (!checker.isSetNonNull(css)) {
      return;
    }
    css = format.toPlainString(css);

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');

    style.type = 'text/css';
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);
  },

  getClassStr: function(obj) {
    var className = '';

    for (var classKey in obj) {
      if (obj[classKey] === true) {
        className += classKey + ' ';
      }
    }

    return className;
  },

  getProp: function(data, id, defaultVal) {
    if (checker.isSetNonNull(data) && checker.isSetNonNull(data[id])) {
      return data[id];
    }
    if (checker.isSet(defaultVal)) {
      return defaultVal;
    }
    return '';
  },

  ensureJSData: function(data) {
    if (checker.isSetNonNull(data) && checker.isFunction(data.toJS)) {
      return data.toJS();
    }
    return data;
  },

  argsToArray: function(args) {
    return Array.prototype.slice.call(args);
  },

  mapToArray: function(dataMap, keyField) {
    var ary = [];
    var isSetKey = checker.isSetNonNull(keyField);
    var curData;
    var curSrcData;
    for (var key in dataMap) {
      curSrcData = dataMap[key];
      if (checker.isObj(curSrcData)) {
        curData = Object.assign({}, dataMap[key]);
        if (isSetKey) {
          curData[keyField] = key;
        }
      } else if (checker.isArray(curSrcData)) {
        curData = curSrcData.slice(0);
      } else {
        curData = curSrcData;
      }

      ary.push(curData);
    }
    return ary;
  },

  arrayToMap: function(dataAry, keyField) {
    var mapData = {};
    var curData;
    for (var i = 0; i < dataAry.length; i++) {
      curData = dataAry[i];
      mapData[curData[keyField]] = curData;
    }
    return mapData;
  },

  getUrlByHost: function(url, hostIP) {
    var targetObj = new Object();
    targetObj.targetHost = '';
    targetObj.targetUrl = url;
    if (checker.isMobile()) {
      targetObj.targetHost = hostIP;
      if (checker.isSsl()) {
        targetObj.targetUrl = 'https://' + targetObj.targetHost + '/';
      } else {
        targetObj.targetUrl = 'http://' + targetObj.targetHost + '/';
      }
    }
    return targetObj;
  },

  reverseStr: function(str) {
    return str.split('').reverse().join('');
  },

  newInstance(constructor, args) {
    var args = Array.prototype.slice.call(args);
    args.unshift(null);
    return new (Function.prototype.bind.apply(
      constructor, args));
  }

});

module.exports = exports = new HexUtil();
