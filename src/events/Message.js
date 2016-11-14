/**
 * Created by macdja38 on 2016-09-20.
 */

"use strict";

export default class Message {
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