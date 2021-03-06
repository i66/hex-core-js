const express = require('express');
const http = require('http');
const https = require('https');
const helmet = require('helmet');
const path = require('path');

const HexGeneralService = require('../hex.general.service');
//const HexWebBaseAuthMgr = require('./hex.web.base.auth.mgr');
//const HexWebBaseKeyMgr = require('./hex.web.base.key.mgr');
//const HexWebBaseSessionMgr = require('./hex.web.base.session.mgr');
//const HexWebAuthStatus = require('./types/hex.web.auth.status');
//const HexWebUserDataStatus = require('./types/hex.web.user.data.status');
//const HexAesHelper = require('../crypt/hex.aes.helper');

const checker = require('../tools/hex.checker');
const validator = require('../tools/hex.validator');
const util = require('../tools/hex.util');

const VALID_DIFF_MS = 5000;
const HEART_BEAT_INT_MIN = 15;

//const MOD_AUTH_MGR = 'authMgr';
//const MOD_KEY_MGR = 'keyMgr';
//const MOD_SESSION_MGR = 'sessionMgr';

const PATH_CERT = './data/cert/';

class HexWebService extends HexGeneralService {
  constructor(type) {
    super(type);
    this._port = 3000;
    this._isSecure = true;
    this._sslKeyFile = PATH_CERT + 'server.key';
    this._sslCertFile = PATH_CERT + 'server.crt';
    this._sslPassPhase = 'Hex54232885';
    this._sslOptions = {};
    this._server = null;
    this._isServiceReady = true;
    this._serviceName = 'HEX General Web Service';
    this._webServer = express();
  }

  get port() {
    return this._port;
  }

  get isSecure() {
    return this._isSecure;
  }

  useRouter(basePath, router) {
    this._useRouter(basePath, router);
  }

  _useRouter(basePath, router) {
    this._webServer.use(basePath, router.router);
    router.setIsDebug(this._isDebug);
  }

  setAllowedOrigin(allowedOriginAry) {
    this._setAllowedOrigin(allowedOriginAry);
  }

  _setAllowedOrigin(allowedOriginAry) {
    this._webServer.use(function(req, res, next) {
      var origin = req.headers.origin;
      if (allowedOriginAry.indexOf(origin) > -1) {
        res.setHeader('Access-Control-Allow-Origin', origin);
      }
      //res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8020');
      res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.header('Access-Control-Allow-Credentials', true);
      return next();
    });
  }

  _defineExtModule(config) {
    //this._regExtModule(MOD_AUTH_MGR, HexWebBaseAuthMgr);
    //this._regExtModule(MOD_KEY_MGR, HexWebBaseKeyMgr);
    //this._regExtModule(MOD_SESSION_MGR, HexWebBaseSessionMgr);
  }

  _init(config, cb) {
    config = this._ensureConfig(config);

    this._isDebug = validator.ensureBool(config.isDebug, this._isDebug);
    this._isSecure = validator.ensureBool(config.isSecure, this._isSecure);
    this._port = validator.ensureInt(config.port, this._port);
    this._sslKeyFile =
      validator.ensureStr(config.sslKeyFile, this._sslKeyFile);
    this._sslCertFile =
      validator.ensureStr(config.sslCertFile, this._sslCertFile);
    this._sslPassPhase =
      validator.ensureStr(config.sslPassPhase, this._sslPassPhase);

    this._logInfo('Port: {0}, isSecure: {1}, sslKeyFile: {2}, sslCertFile: {3}',
      this._port, this._isSecure, this._sslKeyFile, this._sslCertFile
    );

    if (this._isSecure == true) {
      try {
        var fs = require('fs');
        this._sslOptions = {
          key: fs.readFileSync(this._sslKeyFile),
          cert: fs.readFileSync(this._sslCertFile),
          passphrase: this._sslPassPhase
        };
      } catch (ex) {
        this._logError('Failed to load SSL Certs: {0}', ex.toString());
        this._resolveAsyncStatusInit(false, cb);
        return;
      }
    }

    this._resolveAsyncStatusInit(true, cb);
  }

  _postInit(config) {
    //this._authMgr = this._getExtModule(MOD_AUTH_MGR);
    //this._keyMgr = this._getExtModule(MOD_KEY_MGR);
    //this._sessionMgr = this._regExtModule(MOD_SESSION_MGR);
  }

  _startDetail(cb) {

    var server = this._prepareServer();

    var _this = this;
    server.on('error', function(e) {
      _this._logError('Failed to Start Server: {0}', e.toString());
      _this._resolveAsyncStatusStart(false, cb);
    });

    server.on('listening', function(e) {
      _this._logInfo('{0} Listening: {1}, Debug: {2}',
        _this._serviceName, _this._port, _this._isDebug);
      _this._resolveAsyncStatusStart(true, cb);
    });

    // Start Server!
    server.listen(this._port);
    this._server = server;
  }

  _prepareServer() {

    this._initResourceHandler();

    if (this._isSecure) {
      return https.createServer(this._sslOptions, this._webServer);
    } else {
      return http.createServer(this._webServer);
    }
  }

  _initResourceHandler() {

  }

  _regPathHandler(webServicePath, handler) {
    this._webServer.get(webServicePath, handler);
  }

  _regStaticPath(webServicePath, localPath) {
    this._webServer.use(webServicePath, express.static(localPath));
  }

  _getApiPath(basePath, subPath) {
    return basePath + subPath;
  }

}

module.exports = HexWebService;
