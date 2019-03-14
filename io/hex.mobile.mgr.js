var EventEmitter = require('events').EventEmitter;
var checker = require('../../core/tools/hex.checker');
var HexFileMgr = require('./hex.file.mgr.factory').getInstance();

const KEY_READY = 'ready';
const KEY_PAUSE = 'pause';
const KEY_RESUME = 'resume';

var info = {};

var HexMobileMgr = Object.assign({}, EventEmitter.prototype, {
  getInfo: function() {
    return info;
  },

  emitReady: function() {
    console.log('Mobile App Ready!');
    this.emit(KEY_READY);
  },

  emitPause: function(eventType) {
    console.log('Mobile App Paused');
    this.emit(KEY_PAUSE);
  },

  emitResume: function(eventType) {
    console.log('Mobile App Resume');
    this.emit(KEY_RESUME);
  },

  addReadyListener: function(callback) {
    this.on(KEY_READY, callback);
  },

  removeReadyListener: function(callback) {
    this.removeListener(KEY_READY, callback);
  },

  addPauseListener: function(callback) {
    this.on(KEY_PAUSE, callback);
  },

  removePauseListener: function(callback) {
    this.removeListener(KEY_PAUSE, callback);
  },

  addResumeListener: function(callback) {
    this.on(KEY_RESUME, callback);
  },

  removeResumeListener: function(callback) {
    this.removeListener(KEY_RESUME, callback);
  }
});

// Listen
document.addEventListener('deviceready', function() {
  cordova.getAppVersion.getVersionNumber().then(function(data) {
    info.version = data;
  });
  cordova.getAppVersion.getAppName().then(function(data) {
    info.displayName = data;
  });

  HexMobileMgr.emitReady();

  document.addEventListener('pause',
    HexMobileMgr.emitPause.bind(HexMobileMgr), false);
  document.addEventListener('resume',
    HexMobileMgr.emitResume.bind(HexMobileMgr), false);
}, false);

module.exports = HexMobileMgr;
