/**
 * Created by macdja38 on 2016-08-08.
 */

export default class{
  constructor({ msg, prefix, command, args, channel, role, user, language }) { // eslint-disable-line no-unused-vars
    this._channel = channel;
    this._args = args;
    this._command = command;
    this._msg = msg;
    this._role = role;
    this._user = user;
    this._language = language;
    this._prefix = prefix;
  }

  sendMessage(text) {
    this.channel.sendMessage(text);
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