/**
 * Created by macdja38 on 2016-09-20.
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

require("babel-core/register");

require("source-map-support/register");

class Message {
  constructor(message) {
    this._message = message;
  }

  reply(string) {
    return this._message.reply(string);
  }

  sendMessage(string) {
    return this._message.channel.sendMessage(string);
  }
}
exports.default = Message;
//# sourceMappingURL=Message.js.map