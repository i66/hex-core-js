const express = require('express');

const HexGeneralModule = require('../hex.general.module');

var expressInstance = express();

class HexWebRouter extends HexGeneralModule {
  constructor() {
    super();
    this._router = express.Router();
  }

  get router() {
    return this._router;
  }

  _regGetHandler(path, handler) {
    this._router.get(path, handler);
  }

  _regStaticPath(path, localPath) {
    this._router.use(path, express.static(localPath));
  }

  /**
  * Register Post request handler
  *
  * @param {path} - Site Path
  * @param {function} handler(dataStr, req, res) - Handler Function
  * - {string} dataStr - Request Content
  * - {object} req - Request Object
  * - {object} res - Response Object
  */
  _regPostHandler(path, handler) {
    this._router.post(path, function(req, res) {
      req.on('data', function(dataStr) {
        handler(dataStr, req, res);
      });
    });
  }
}

module.exports = HexWebRouter;
