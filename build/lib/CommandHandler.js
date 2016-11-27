/**
 * Created by macdja38 on 2016-09-20.
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

require("babel-core/register");

require("source-map-support/register");

var _CommandParser = require("./CommandParser");

var _CommandParser2 = _interopRequireDefault(_CommandParser);

var _commands = require("../commands");

var _commands2 = _interopRequireDefault(_commands);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class CommandHandler {
  constructor() {
    this._pingsRecieved = {};
    this._pingsResponded = {};
    this._pingsDelay = {};
    this._pingsError = {};
    this._commands = [];
    this.loadAllCommands();
  }

  onMessage(message) {
    let userCommand = (0, _CommandParser2.default)({ message, channel: message.channel, prefixes: ["!!", "*"], id: message.client.user.id });
    userCommand.setLanguage("en");
    this._commands.forEach(c => {
      if (c.aliases.indexOf(userCommand.command) > -1) {
        c.exec(userCommand);
      }
    });
  }

  loadModules(modules) {
    this.modules = modules;
  }

  loadAllCommands() {
    this._commands = [];
    (0, _commands2.default)().forEach(c => c.forEach(c => this._commands.push(new c())));
    this._commands.forEach(c => c.init());
  }
}
exports.default = CommandHandler;
//# sourceMappingURL=CommandHandler.js.map