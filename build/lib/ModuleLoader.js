"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ModuleLoader = undefined;

require("babel-core/register");

require("source-map-support/register");

var _modules = require("../modules");

var _modules2 = _interopRequireDefault(_modules);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ModuleLoader {
  constructor(e) {
    this._modules = [];
    this._e = e;
  }

  loadAll() {
    this._modules = (0, _modules2.default)().map(M => new M(this._e));
  }

  get modules() {
    return this._modules;
  }
}

exports.ModuleLoader = ModuleLoader;
exports.default = ModuleLoader;
//# sourceMappingURL=ModuleLoader.js.map