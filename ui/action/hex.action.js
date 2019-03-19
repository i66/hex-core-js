'use strict';

// Constants and Types
var HexActionType = require('../types/hex.action.type');
var HexActionMethodType = require('../types/hex.action.method.type');

// Modules
var AppDispatcher = require('../dispatcher/hex.dispatcher');

var HexActions = {

  // Notify App Init
  // Receiver: HexPrefStore
  appInit: function() {
    AppDispatcher.dispatch({
      actionType: HexActionType.APP_INIT,
    });
  },

  // Receiver: HexConsoleStore
  toggleConsole: function() {
    AppDispatcher.dispatch({
      actionType: HexActionType.TOGGLE_CONSOLE,
    });
  },

  // Receiver: HexConsoleStore
  clearConsoleLog: function() {
    AppDispatcher.dispatch({
      actionType: HexActionType.LOG_CLEAR,
    });
  },

  // Notify Store Reset
  // Receiver: All Store
  resetStore: function() {
    AppDispatcher.dispatch({
      actionType: HexActionType.RESET_STORE,
    });
  },

  // Notify user preference is changed
  // Receiver: HexPrefStore
  changePref: function(pref) {
    AppDispatcher.dispatch({
      actionType: HexActionType.PREF_CHANGE,
      data: pref,
    });
  },

  // Receiver: HexPrefStore
  changePrefField: function(prefKey, prefVal) {
    var pref = {};
    pref[prefKey] = prefVal;
    AppDispatcher.dispatch({
      actionType: HexActionType.PREF_CHANGE,
      data: pref,
    });
  },

  // Notify app language is changed
  // Receiver: HexLangStore
  changeLang: function(lang) {
    AppDispatcher.dispatch({
      actionType: HexActionType.LANG_CHANGE,
      data: lang,
    });
  }

};

module.exports = HexActions;
