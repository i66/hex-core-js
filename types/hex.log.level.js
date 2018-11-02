
var HexLogLevel = {
  VERBOSE: 4,
  DEBUG: 3,
  NORMAL: 2,
  HIGH: 1,
  CORE: 0,

  getStr: function(logLevel) {
    switch (logLevel) {
      case this.VERBOSE:
        return 'Verbose(4)';
      case this.DEBUG:
        return 'Debug(3)';
      case this.NORMAL:
        return 'Normal(2)';
      case this.HIGH:
        return 'High Only(1)';
      case this.CORE:
        return 'Core Only(0)';
    }
  }
};

module.exports = HexLogLevel;
