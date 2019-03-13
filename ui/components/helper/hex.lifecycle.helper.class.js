var logger = require('../../tools/hex.logger');
var checker = require('../../tools/hex.checker');
var util = require('../../tools/hex.util');

// Constructor
function HexLifeCycleHelperClass(id, reactInstance) {
  this.id = id;
  this.target = reactInstance;
  this.initStat = {};
  this.checkPropKeyAry = [];
  this.checkPropFuncAry = [];
  this.checkStatKeyAry = [];
  this.checkStatFuncAry = [];
  this.mountFunc = null;
  this.unmountFunc = null;
  this.isDebug = false;
  this.isUpdateOnStatChange = false;
  this.isUpdateOnPropChange = false;
  this.renderTimes = 0;
  this.resetPropKey = null;
  this.resetStateKeys = [];
}

HexLifeCycleHelperClass.prototype.setDebug = function(isDebug) {
  this.isDebug = isDebug;
};

HexLifeCycleHelperClass.prototype.setInitStat = function(key, val) {
  this.initStat[key] = val;
};
HexLifeCycleHelperClass.prototype.setInitStatSet = function(initStat) {
  this.initStat = initStat;
};
HexLifeCycleHelperClass.prototype.getInitStatSet = function() {
  if (this.isDebug == true) {
    logger.info('getInitialState', this.id);
    logger.info(this.initStat, this.id);
  }
  return this.initStat;
};
HexLifeCycleHelperClass.prototype.getInitStat = function(key) {
  return this.initStat[key];
};

HexLifeCycleHelperClass.prototype.setInitFunc = function(func) {
  this.mountFunc = func;
};
HexLifeCycleHelperClass.prototype.setUninitFunc = function(func) {
  this.unmountFunc = func;
};
HexLifeCycleHelperClass.prototype.onMount = function() {
  if (this.isDebug == true) {
    logger.info('componentWillMount', this.id);
  }
  if (checker.isFunction(this.mountFunc)) {
    if (this.isDebug == true) {
      logger.info('componentWillMount, call', this.id);
      logger.info(this.mountFunc);
    }
    this.mountFunc.call(this.target);
  }
};
HexLifeCycleHelperClass.prototype.onUnMount = function() {
  if (this.isDebug == true) {
    logger.info('componentWillUnmount', this.id);
  }
  if (checker.isFunction(this.unmountFunc)) {
    if (this.isDebug == true) {
      logger.info('componentWillUnmount, call', this.id);
      logger.info(this.unmountFunc);
    }
    this.unmountFunc.call(this.target);
  }
};

HexLifeCycleHelperClass.prototype.onNextProps = function(nextProps) {
  if (this.isDebug == true) {
    logger.info('componentWillReceiveProps', this.id);
    logger.info(nextProps);
  }
};
HexLifeCycleHelperClass.prototype.addCheckPropStatKey = function(keys) {
  this.addCheckPropKey(keys);
  this.addCheckStatKey(keys);
};

/*
HexLifeCycleHelperClass.prototype.addCheckPropKey = function(key) {
  this.checkPropKeyAry.push(key);
};
*/

HexLifeCycleHelperClass.prototype.addCheckPropKey = function(keys) {
  for (var idx in keys) {
    this.checkPropKeyAry.push(keys[idx]);
  }
};
HexLifeCycleHelperClass.prototype.addCheckStatKey = function(keys) {
  for (var idx in keys) {
    this.checkStatKeyAry.push(keys[idx]);
  }
};
HexLifeCycleHelperClass.prototype.addCheckPropFunc = function(funcs) {
  for (var idx in funcs) {
    this.checkPropFuncAry.push(funcs[idx]);
  }
};
HexLifeCycleHelperClass.prototype.addCheckStatFunc = function(funcs) {
  for (var idx in funcs) {
    this.checkStatFuncAry.push(funcs[idx]);
  }
};
/*
HexLifeCycleHelperClass.prototype.addCheckStatKey = function(key) {
  this.checkStatKeyAry.push(key);
};
*/


HexLifeCycleHelperClass.prototype.setResetPropKey =
function(key, resetStateKeys) {
  this.resetPropKey = key;
  if (checker.isArray(resetStateKeys)) {
    this.resetStateKeys = resetStateKeys;
  }
};

HexLifeCycleHelperClass.prototype.setIsUpdateOnPropChange =
function(isUpdateOnPropChange) {
  this.isUpdateOnPropChange = isUpdateOnPropChange;
};
HexLifeCycleHelperClass.prototype.setIsUpdateOnStatChange =
function(isUpdateOnStatChange) {
  this.isUpdateOnStatChange = isUpdateOnStatChange;
};

HexLifeCycleHelperClass.prototype.updateStateSet = function(statObj, isMerge) {
  if (this.isDebug == true) {
    logger.info('SetState! ', this.id);
    logger.info(statObj);
  }
  if (isMerge != false) {
    var curStat = this.target.state;
    var mergedStat = Object.assign(curStat, statObj);
    this.target.setState(mergedStat);
  } else {
    this.target.setState(statObj);
  }

};

HexLifeCycleHelperClass.prototype.updateState = function(key, val) {
  if (this.isDebug == true) {
    logger.info('SetState Val! - ' + key, this.id);
    logger.info(val);
  }
  var statObj = {};
  statObj[key] = val;
  this.target.setState(statObj);
};

HexLifeCycleHelperClass.prototype.updateStateSlient = function(key, val) {
  if (this.isDebug == true) {
    logger.info('SetState Val Slient! - ' + key, this.id);
    logger.info(val);
  }
  this.target.state[key] = val;
};


HexLifeCycleHelperClass.prototype.shouldUpdate =
function(nextProps, nextState) {
  if (this.isDebug == true) {
    logger.info('shouldComponentUpdate ??', this.id);
  }

  if (this.resetPropKey != null) {
    if (this.target.props[this.resetPropKey] !== nextProps[this.resetPropKey]) {
      if (this.isDebug == true) {
        logger.info('Reset Prop Key Changed! Reset!', this.id);
      }

      var resetState = this.getInitStat();
      if (this.resetStateKeys.length > 0) {
        var initStat = resetState;
        resetState = {};
        var curKey;
        for (var i = 0; i < this.resetStateKeys.length; i++) {
          curKey = this.resetStateKeys[i];
          resetState[curKey] = initStat[curKey];
        }
      }
      //this.target.replaceState(resetState);
      this.target.setState(resetState);
      return false;
    }
  }

  var shouldUpdate = false;
  if (shouldUpdate == false) {
    shouldUpdate = this.shouldUpdateProp(nextProps, nextState);
  }

  if (shouldUpdate == false) {
    shouldUpdate = this.shouldUpdateStat(nextProps, nextState);
  }

  if (this.isDebug == true) {
    if (shouldUpdate == true) {
      logger.info('Should Update!', this.id);
    } else {
      logger.info('Should NOT Update!', this.id);
    }
  }

  return shouldUpdate;
};
HexLifeCycleHelperClass.prototype.shouldUpdateProp =
function(nextProps, nextState) {
  if (this.isUpdateOnPropChange == true) {
    return true;
  }
  var curKey;
  var curFunc;

  // Check Prop Key
  for (var i = 0; i < this.checkPropKeyAry.length; i++) {
    curKey = this.checkPropKeyAry[i];
    if (this.target.props[curKey] !== nextProps[curKey]) {
      if (this.isDebug == true) {
        logger.info('Should Update! - Prop Changed: ' + curKey, this.id);
        var jsProp = util.ensureJSData(this.target.props[curKey]);
        var jsNextProp = util.ensureJSData(nextProps[curKey]);
        logger.info(jsProp);
        logger.info(jsNextProp);
        //logger.info(deepDiff(jsProp, jsNextProp));
      }
      return true;
    }
  }

  // Check Prop Func
  for (var i = 0; i < this.checkPropFuncAry.length; i++) {
    curFunc = this.checkPropFuncAry[i];
    if (curFunc.call(this.target, nextProps) == true) {
      if (this.isDebug == true) {
        logger.info('Should Update! - Prop Check', this.id);
        logger.info(curFunc);
      }
      return true;
    }
  }

  return false;
};
HexLifeCycleHelperClass.prototype.shouldUpdateStat =
function(nextProps, nextState) {
  if (this.isUpdateOnStatChange == true) {
    return true;
  }
  var curKey;
  var curFunc;
  // Check Stat Key
  for (var i = 0; i < this.checkStatKeyAry.length; i++) {
    curKey = this.checkStatKeyAry[i];
    if (this.target.state[curKey] !== nextState[curKey]) {
      if (this.isDebug == true) {
        logger.info('Should Update! - Stat Changed: ' + curKey, this.id);
        logger.info(this.target.state[curKey]);
        logger.info(nextState[curKey]);

        var jsProp = util.ensureJSData(this.target.state[curKey]);
        var jsNextProp = util.ensureJSData(nextState[curKey]);
        //logger.info(deepDiff(jsProp, jsNextProp));
      }
      return true;
    }
  }

  // Check Prop Func
  for (var i = 0; i < this.checkStatFuncAry.length; i++) {
    curFunc = this.checkStatFuncAry[i];
    if (curFunc.call(this.target, nextState) == true) {
      if (this.isDebug == true) {
        logger.info('Should Update! - Stat Check', this.id);
        logger.info(curFunc);
      }
      return true;
    }
  }
  return false;
};

HexLifeCycleHelperClass.prototype.willUpdate = function(nextProps, nextState) {
  if (this.isDebug == true) {
    logger.info('componentWillUpdate', this.id);
  }
};

HexLifeCycleHelperClass.prototype.onRender = function() {
  if (this.isDebug == true) {
    this.renderTimes++;
    logger.info(' - RENDER !!!!!! - ' + this.renderTimes, this.id);
  }
};

module.exports = HexLifeCycleHelperClass;
