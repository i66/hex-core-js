'use strict';

var logger = require('../tools/hex.logger');
var checker = require('../tools/hex.checker');
var util = require('../tools/hex.util');
var validator = require('../tools/hex.validator');

const MODULE_ID = 'HexAudioMgr';

var _audioMap = {};
var _audioInstanceMap = {};
var _audioLoopMap = {};
var _isMuted = false;

var _audioClass = global.Audio;

var HexAudioMgr = {

  register: function(id, path) {
    _audioMap[id] = path;
  },

  play: function(id) {
    if (_isMuted == true) {
      return false;
    }
    var audio = this._getAudio(id);
    if (audio == null) {
      logger.warn('play / Sound not found:' + id, MODULE_ID);
      return false;
    }
    if (audio.refIsPlaying == false) {
      audio.play();
      audio.refIsPlaying = true;
    }

    return true;
  },

  playLoop: function(id) {
    _audioLoopMap[id] = true;
    if (_isMuted == true) {
      return false;
    }
    var audio = this._getAudio(id);
    if (audio == null) {
      logger.warn('playLoop / Sound not found:' + id, MODULE_ID);
      return false;
    }
    audio.loop = true;

    if (audio.refIsPlaying == false) {
      audio.refIsPlaying = true;
      if (checker.isMobile()) {
        audio.play({numberOfLoops: 99999});
      } else {
        audio.play();
      }
    }

    return true;
  },

  stop: function(id) {
    delete _audioLoopMap[id];
    return this._stopAudio(id);
  },

  setMuted: function(isMuted) {
    logger.info('Audio Muted:' + isMuted, MODULE_ID);
    _isMuted = validator.ensureBoolean(isMuted, _isMuted);
    this._updateAudioStat();
  },

  setAudioClass: function(audioClass) {
    _audioClass = audioClass;
  },

  getIsMuted: function() {
    return _isMuted;
  },

  getPath: function(id) {
    return util.getProp(_audioMap, id, null);
  },

  getInstance: function(id) {
    return util.getProp(_audioInstanceMap, id, null);
  },

  isSetLoop: function(id) {
    return util.getProp(_audioLoopMap, id, false);
  },

  reset: function() {
    _audioMap = {};
    _audioInstanceMap = {};
    _audioLoopMap = {};
    _isMuted = false;
    _audioClass = global.Audio;
  },

  _stopAudio: function(id) {
    var audio = this._getAudio(id);
    if (audio == null) {
      logger.warn('stop / Sound not found:' + id, MODULE_ID);
      return false;
    }

    if (checker.isMobile()) {
      audio.stop();
    } else {
      var isPlaying = audio.currentTime > 0 && !audio.paused && !audio.ended &&
      audio.readyState > 2;
      if (isPlaying) {
        audio.pause();
      }
      audio.currentTime = 0;
    }

    audio.refIsPlaying = false;

    return true;
  },

  _updateAudioStat: function() {
    if (_isMuted == true) {
      // Stop all sounds
      for (var id in _audioMap) {
        this._stopAudio(id);
      }
    } else {
      // Play loop
      for (var id in _audioLoopMap) {
        this.playLoop(id);
      }
    }
  },

  getPhoneGapPath: function() {
    var path = decodeURI(window.location.pathname);
    path = path.substr(path, path.length - 10);
    return path;
 },

  _getAudio: function(id) {
    var audio = this._getAudioInstance(id);
    if (audio == null) {
      var path = this._getAudioPath(id);
      if (path != null) {
        if (checker.isMobile()) {
          if (path.indexOf('./') == 0) {
            path = path.replace('./', '');
          }

          var filePath =
              decodeURI(cordova.file.applicationDirectory) + 'www/' + path;

          if (checker.isIOS()) {
            filePath = filePath.replace('file://', '');
          }


          //var filePath = this.getPhoneGapPath() + path;
          //filePath = filePath.replace('file://', '');

          var audio = new Media(filePath, null,
            function(e) {
            console.log(JSON.stringify(e));
          }, function(status) {
            /*
            if (status === Media.MEDIA_STOPPED) {
              if (audio.loop == true) {
                audio.play();
              }
            }
            */
          });

          audio.setVolume('1.0');
        } else {
          audio = new _audioClass(path);
        }

        audio.refIsPlaying = false;
        this._saveAudioInstance(id, audio);
      } else {
        audio = null;
      }
    }
    return audio;
  },

  _onMobileStatus: function(status) {
    console.log('Audio:' + status);
    /*
    if (status === Media.MEDIA_STOPPED) {
      if (audio.loop == true) {
        audio.play();
      }
    }
    */

  },

  _saveAudioInstance: function(id, audio) {
    _audioInstanceMap[id] = audio;
  },

  _getAudioInstance: function(id) {
    return util.getProp(_audioInstanceMap, id, null);
  },

  _getAudioPath: function(id) {
    return util.getProp(_audioMap, id, null);
  }

};

module.exports = HexAudioMgr;
