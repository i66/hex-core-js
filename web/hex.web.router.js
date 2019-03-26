const express = require('express');
const bodyParser = require('body-parser');

const HexGeneralModule = require('../hex.general.module');

var expressInstance = express();

class HexWebRouter extends HexGeneralModule {
  constructor() {
    super();
    this._router = express.Router();
    this._router.use(bodyParser.json());
    this._router.use(bodyParser.urlencoded({extended: true}));
  }

  get router() {
    return this._router;
  }

  _regGetHandler(path, handler) {
    this._router.get(path, handler);
  }

  _regStaticPath(path, localPath, isServeDotFile) {
    var option = {};
    if (isServeDotFile == true) {
      option.dotfiles = 'allow';
    }
    this._router.use(path, express.static(localPath, option));
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
      handler(req.body, req, res);
    });
  }
}

module.exports = HexWebRouter;
