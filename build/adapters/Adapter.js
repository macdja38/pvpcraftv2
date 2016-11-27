/**
 * Created by macdja38 on 2016-09-18.
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

require("babel-core/register");

require("source-map-support/register");

class Adapter {
  constructor() {}

  register(commandHandler) {
    this._commandHandler = commandHandler;
  }
}
exports.default = Adapter;
//# sourceMappingURL=Adapter.js.map