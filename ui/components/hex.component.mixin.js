// External Modules
var React = require('react');
var createReactClass = require('create-react-class');

var HexPropType = require('../../types/hex.prop.type');
var HexStoreDataMgr = require('../../io/hex.store.data.mgr');
var HexL10nMgr = require('../../io/hex.l10n.mgr');
var HexCssHelperClass = require('./helper/hex.css.helper.class');
var HexViewParamHelperClass = require('./helper/hex.viewparam.helper.class');
var HexUiDataHelper = require('./helper/hex.ui.data.helper');
var HexLifeCycleHelperClass = require('./helper/hex.lifecycle.helper.class');

var logger = require('../../tools/hex.logger');
var checker = require('../../tools/hex.checker');
var util = require('../../tools/hex.util');
var format = require('../../tools/hex.format');

var _isPrototypeRender = false;

var HexComponentMixin = {
  _mxIsCustomRender: false,
  _mxViewParamHelper: null,
  _mxCssHelper: null,
  _mxLifeCycleHelper: null,
  _mxEventMap: null,
  _mxUiDataHelper: HexUiDataHelper,

  // React Component Lifecycle functions
  // -----------------------------------------------------------------

  // Function to be implemented:
  // _mxPreInit() - Set init status
  // _mxInit() - Init (creation)
  // _mxMount() - Component mount
  // _mxPreRender() - Call before every render
  // _mxUpdateProps() - Update data for render
  // _mxRenderDetail() - Render function
  // _mxPostRender() - Call after every render
  // _mxUnmount() - Component unmount
  // _mxUnInit() - Uninit (destroy)

  getInitialState: function() {
    this._mxViewParamHelper = new HexViewParamHelperClass();
    this._mxCssHelper = new HexCssHelperClass();
    this._mxEventMap = {};
    this._mxDataEventMap = {};
    this._mxLifeCycleHelper = new HexLifeCycleHelperClass(this.id, this);
    this._callIfDefined(this._mxPreInit);
    return this._mxLifeCycleHelper.getInitStatSet();
  },
  componentWillMount: function() {
    if (this._mxInit) {
      this._mxInit();
    }
    //this._mxLifeCycleHelper.onMount();
  },
  componentDidMount: function() {
    this._callIfDefined(this._mxMount);
  },
  componentWillReceiveProps: function(nextProps) {
    this._mxLifeCycleHelper.onNextProps(nextProps);
    this._callIfDefined(this._mxPropUpdated);
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    return this._mxLifeCycleHelper.shouldUpdate(nextProps, nextState);
  },
  componentWillUpdate: function(nextProps, nextState) {
    this._mxLifeCycleHelper.willUpdate(nextProps, nextState);
    this._callIfDefined(this._mxPreRender);
  },
  componentDidUpdate: function(nextProps, nextState) {
    this._callIfDefined(this._mxPostRender);
  },
  componentWillUnmount: function() {
    this._callIfDefined(this._mxUnmount);
    this._callIfDefined(this._mxUnInit);
    //this._mxLifeCycleHelper.onUnMount();
  },

  render: function() {
    try {
      var viewParam = this.mxGetProp(HexPropType.VIEW_PARAM, null);
      if (viewParam != null && this._mxViewParamHelper != null) {
        this._mxViewParamHelper.setViewParam(viewParam);
      }
      this._callIfDefined(this._mxUpdateProps);

      if (_isPrototypeRender == true && this._mxRenderProto) {
        return this._mxRenderProto();
      }
      if (this._mxIsCustomRender == true) {
        this._mxCustomRender();
      } else {
        this._mxLifeCycleHelper.onRender();
        return this._mxRenderDetail();
      }
    } catch (e) {
      console.error(e);
      logger.error(e.stack, this._mxLifeCycleHelper.id);
      return null;
    }
  },

  // Public functions
  // -----------------------------------------------------------------

  // Private functions
  // -----------------------------------------------------------------
  _callIfDefined: function(func) {
    if (checker.isFunction(func)) {
      func();
    }
  },

  // Mixin Shared functions
  // -----------------------------------------------------------------
  mxSetIsDebug: function(isDebug) {
    this._mxLifeCycleHelper.setDebug(isDebug);
  },

  mxSetInitStat: function(key, val) {
    this._mxLifeCycleHelper.setInitStat(key, val);
  },

  mxSetInitStatSet: function(initStat) {
    this._mxLifeCycleHelper.setInitStatSet(initStat);
  },

  mxSetIsCheckProp: function(isCheckProp) {
    this._mxLifeCycleHelper.setIsUpdateOnPropChange(isCheckProp);
  },
  mxSetIsCheckStat: function(isCheckStat) {
    this._mxLifeCycleHelper.setIsUpdateOnStatChange(isCheckStat);
  },
  mxSetIsPrototype: function(isPrototype) {
    _isPrototypeRender = isPrototype;
  },
  mxSetEventHandler: function(eventType, handlerFunc) {
    this._mxEventMap[eventType] = handlerFunc;
  },
  mxSetForwardEvent: function(eventType, handlerFunc) {
    this._mxEventMap[eventType] = this.mxEmitEvent.bind(this, eventType);
  },
  mxSetDataHandler: function(eventType, handlerFunc) {
    this._mxDataEventMap[eventType] = handlerFunc;
  },

  mxSetStatSet: function(statObj, isMerge) {
    this._mxLifeCycleHelper.updateStateSet(statObj, isMerge);
  },
  mxSetStat: function(key, val) {
    this._mxLifeCycleHelper.updateState(key, val);
  },
  /*
  mxUpdateStatValList: function(valList) {
    var statObj = {};
    for (var i = 0; i < valList.length; i++) {
      statObj[valList[i][0]] = valList[i][1];
    }
    this._mxLifeCycleHelper.updateState(statObj);
  },
  */

  mxToggleStat: function(key) {
    var val = this.mxGetState(key);
    if (checker.isBool(val)) {
      val = !val;
      this._mxLifeCycleHelper.updateState(key, val);
    }
    return val;
  },
  mxSetStatSlient: function(key, val) {
    this._mxLifeCycleHelper.updateStateSlient(key, val);
  },

  mxAddCheckPropKey: function() {
    this._mxLifeCycleHelper.addCheckPropKey(util.argsToArray(arguments));
  },
  mxAddCheckStatKey: function() {
    this._mxLifeCycleHelper.addCheckStatKey(util.argsToArray(arguments));
  },
  mxAddCheckPropStatKey: function() {
    this._mxLifeCycleHelper.addCheckStatKey(util.argsToArray(arguments));
  },
  mxAddCheckPropFunc: function() {
    this._mxLifeCycleHelper.addCheckPropFunc(util.argsToArray(arguments));
  },
  mxAddCheckStatFunc: function() {
    this._mxLifeCycleHelper.addCheckStatFunc(util.argsToArray(arguments));
  },
  mxSetResetPropKey: function(key, resetStateKeyAry) {
    this._mxLifeCycleHelper.setResetPropKey(key, resetStateKeyAry);
  },

  mxGetProp: function(key, defaultValue) {
    var val = this.props[key];
    if (!checker.isSet(val)) {
      val = defaultValue;
    }
    return val;
  },
  mxGetPropAry: function(key, defaultValue) {
    return HexStoreDataMgr.getAry(this.mxGetProp(key), defaultValue);
  },
  mxGetPropMap: function(key, defaultValue) {
    return HexStoreDataMgr.getMap(this.mxGetProp(key), defaultValue);
  },
  mxGetPropInit: function(key, curValue, noValue, defaultValue) {
    if (curValue == noValue) {
      return HexStoreDataMgr.getMap(this.mxGetProp(key), defaultValue);
    }
    return curValue;
  },
  mxGetState: function(key, defaultValue) {
    var val = this.state[key];
    if (!checker.isSet(val)) {
      val = this._mxLifeCycleHelper.getInitStat(key);
      if (!checker.isSet(val)) {
        val = defaultValue;
      }
    }
    return val;
  },

  mxGetPropThenState: function(statKey, propKey, defaultValue) {
    var res = this.mxGetProp(propKey);
    if (!checker.isSetNonNull(res)) {
      res = this.mxGetState(statKey);
    }
    if (!checker.isSetNonNull(res)) {
      return defaultValue;
    }
    return res;
  },

  mxGetPropFallback: function(key, viewParamKey, defaultValue) {
    var val = this.mxGetState(key, null);
    if (val == null && this._mxViewParamHelper != null) {
      val = this._mxViewParamHelper.getValue(viewParamKey, null);
    }
    if (val == null) {
      val = this.mxGetProp(key, defaultValue);
    }
    return val;
  },
  mxGetViewParamProp: function(key, defaultValue) {
    return this._mxViewParamHelper.getValue(key, defaultValue);
  },
  mxGetRes: function(key) {
    var res = HexL10nMgr.get(key);
    var token = res.split('\n');
    if (token.length == 1) {
      return res;
    }
    /*
    return res.split('\n').map(function(item, key) {
      return (
        <span key={key}>
          {item}
          <br/>
        </span>
      );
    });
    */
  },
  mxGetResTpl: function(key) {
    var args = Array.prototype.slice.call(arguments);
    if (args.length > 1) {
      args[0] = HexL10nMgr.get(key);
      return format.str.apply(null, args);
    } else {
      return HexL10nMgr.get(key);
    }
  },
  mxGetPref: function(key) {
    var pref = this.mxGetPropMap(HexPropType.PREF, null);
    if (pref == null) {
      return null;
    }
    return util.getProp(pref, key, null);
  },

  mxManualRender: function() {
    this.forceUpdate();
  },

  // Event functions
  // -----------------------------------------------------------------
  mxEmitEvent: function(eventType, param) {
    if (this.props.onEvent) {
      return this.props.onEvent(eventType, param);
    }
  },
  mxHandleData: function(eventType, param) {
    if (this.props.onDataEvent) {
      return this.props.onDataEvent(eventType, param);
    }
  },
  mxHandleEvent: function(eventType, param) {
    var handler = this._mxEventMap[eventType];
    if (checker.isFunction(handler)) {
      handler(param);
    }

    // call global event handler if exist
    if (this._onEvent) {
      this._onEvent(eventType, param);
    }
  },
  mxHandleDataEvent: function(eventType, param) {
    var handler = this._mxDataEventMap[eventType];
    if (checker.isFunction(handler)) {
      return handler(param);
    }

    return null;
  },

  mxSetLocalProp: function(key, value) {
    if (checker.isSetNonNull(Storage)) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  },

  mxGetLocalProp: function(key, defaultValue) {
    if (checker.isSetNonNull(Storage)) {
      var res = localStorage.getItem(key);
      if (!checker.isSetNonNull(res)) {
        return defaultValue;
      }
      try {
        var data = JSON.parse(res);
        return data;
      } catch (err) {

      }

      return defaultValue;
    }
  }

  // Private functions (need to be overrided)
  // -----------------------------------------------------------------

};

module.exports = HexComponentMixin;
