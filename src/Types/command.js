/**
 * Created by macdja38 on 2016-08-08.
 */

export default class{
  constructor({ msg, prefix, command, args, channel, role, user, language }) { // eslint-disable-line no-unused-vars
    this.channel = channel;
    this.args = args;
    this.command = command;
    this.msg = msg;
    this.role = role;
    this.user = user;
    this.language = language;
    this.prefix = prefix;
  }

  getChannel() {
    return this.channel;
  }
}