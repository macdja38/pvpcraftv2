/**
 * Created by macdja38 on 2016-08-08.
 */
"use strict";
import "babel-core/register";
import "source-map-support/register";

export default class{
  constructor({ message, prefix, command, args, options, flags, channel, role, user, language }) { // eslint-disable-line no-unused-vars
    this._channel = channel;
    this._args = args;
    this._command = command;
    this._options = options;
    this._flags = flags;
    this._message = message;
    this._role = role;
    this._user = user;
    this._language = language;
    this._prefix = prefix;
  }

  get guild() {
    return this._channel.guild;
  }

  get command() {
    return this._command;
  }

  sendMessage(...args) {
    this.message.sendMessage(...args);
  }

  get message() {
    return this._message;
  }

  reply(...args) {
    this.message.reply(...args);
  }
  
  setLanguage(language) {
    this._language = language;
  }

  get channel() {
    return this._channel;
  }

  get args() {
    return this._args;
  }

  get msg() {
    return this._msg;
  }

  get role() {
    return this._role;
  }

  get flags() {
    return this._flags;
  }

  get options() {
    return this._options;
  }

  get user() {
    return this._user;
  }

  get language() {
    return this._language;
  }

  get prefix() {
    return this._prefix;
  }
}