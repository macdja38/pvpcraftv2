"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ModuleLoader = undefined;

var _modules = require("../modules");

var _modules2 = _interopRequireDefault(_modules);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ModuleLoader {
  constructor() {
    this._modules = [];
  }

  loadAll() {
    console.log("modules", (0, _modules2.default)());
  }
}

exports.ModuleLoader = ModuleLoader;
exports.default = ModuleLoader;
//# sourceMappingURL=ModuleLoader.js.map