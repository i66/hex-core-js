const HexGeneralConfig = require('../../hex.general.config');

class HexWebServiceConig extends HexGeneralConfig {
  constructor(port, isSecure, sslKeyFile, sslCertFile, sslPassPhase, isDebug) {
    super(isDebug);

    this.port = port;
    this.isSecure = isSecure;
    this.sslKeyFile = sslKeyFile;
    this.sslCertFile = sslCertFile;
    this.sslPassPhase = sslPassPhase;
  }
}

module.exports = HexWebServiceConig;
