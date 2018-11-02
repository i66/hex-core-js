
var HexModuleStatus = {

  CREATED: 0,
  PRE_INIT: 1,
  INIT: 2,
  INIT_OK: 3,
  POST_INIT: 4,
  READY: 5,
  STARTING: 6,
  STARTED: 7,
  STOPPING: 8,
  STOPPED: 9,
  UNKNOWN: -1,
  INIT_ERROR: -2,
  RUN_ERROR: -3,
  STOP_ERROR: -4,
  EXT_MOD_ERROR: -5,
  CONFIG_ERROR: -6,
  UNKNOWN_ERROR: -7,

  ensure: function(status) {
    if (status < this.UNKNOWN_ERROR || status > this.STOPPED) {
      return this.UNKNOWN;
    }
    return status;
  },
  getStr: function(status) {
    switch (status) {
      case this.CREATED:
        return 'Created';
      case this.PRE_INIT:
        return 'Pre-Init';
      case this.INIT:
        return 'Init';
      case this.INIT_OK:
        return 'Init-OK';
      case this.POST_INIT:
        return 'Post-Init';
      case this.READY:
        return 'Ready';
      case this.STARTING:
        return 'Starting';
      case this.STARTED:
        return 'Started';
      case this.STOPPING:
        return 'Stopping';
      case this.STOPPED:
        return 'Stopped';
      case this.UNKNOWN:
        return 'Unknown';
      case this.INIT_ERROR:
        return 'Init Error';
      case this.RUN_ERROR:
        return 'Run Error';
      case this.STOP_ERROR:
        return 'Stop Error';
      case this.EXT_MOD_ERROR:
        return 'External Module Error';
      case this.CONFIG_ERROR:
        return 'Config Error';
      case this.UNKNOWN_ERROR:
        return 'Unknown Error';
    }
  }
};

module.exports = HexModuleStatus;
