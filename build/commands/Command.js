/**
 * Created by macdja38 on 2016-11-13.
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Command = undefined;

require("babel-core/register");

require("source-map-support/register");

class Command {
  constructor(...args) {
    let options = args.pop();
    this.aliases = options.aliases;
    this.modules = {};
  }

  recieveModules(modules) {
    this.modules = modules;
  }
}

exports.Command = Command;
exports.default = Command;
//# sourceMappingURL=Command.js.map