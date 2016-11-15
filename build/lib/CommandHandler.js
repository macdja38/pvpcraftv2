/**
 * Created by macdja38 on 2016-09-20.
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

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
      console.log(c.aliases, userCommand.command);
      if (c.aliases.indexOf(userCommand.command) > -1) {
        c.exec(userCommand);
        userCommand.reply("Wow, that's a command");
      }
    });
    console.log("command", userCommand);
  }

  loadAllCommands() {
    this._commands = [];
    console.log((0, _commands2.default)());
    (0, _commands2.default)().forEach(c => c.forEach(c => this._commands.push(new c())));
    console.log(this._commands);
    this._commands.forEach(c => c.init());
    console.log("commands", (0, _commands2.default)());
  }
}
exports.default = CommandHandler;
//# sourceMappingURL=CommandHandler.js.map