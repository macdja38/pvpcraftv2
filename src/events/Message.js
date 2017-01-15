/**
 * Created by macdja38 on 2016-09-20.
 */

"use strict";
import "babel-core/register";
import "source-map-support/register";

export default class Message {
  constructor(message, client) {
    this._message = message;
    this._client = client;
  }

  reply(string) {
    return this._message.reply(string);
  }

  get client() {
    return this._client;
  }

  get clientUser() {
    return this.client.user;
  }

  sendMessage(string) {
    return this._message.channel.sendMessage(string);
  }
}