/**
 * Created by macdja38 on 2016-08-08.
 */

import Command from "../types/command";

const regargs = /^((?:.|\n)*?)(?= -|$)/;
const regAll = /(?:(?:\s--)(\w+).(\n|.*?)(?= -|\n|$)|(?:\s-)([^-]*?)(?= -|\n|$))/g;

const defaults = {
  allowMention: false,
  botName: false
};

export default class{
  constructor({ client, options }) { // eslint-disable-line no-unused-vars
    if (!options) {
      options = {};
    }

    for (var key in defaults) {
      if (!options.hasOwnProperty(key)) {
        options[key] = defaults[key];
      }
    }

    this.client = client;
  }

  parseMessage(message, prefix, id) {
    let { prefixUsed, command, args } = this.dissectContent(message.content, prefix, id);
    return new Command({
      prefix: prefixUsed, command, args
    });
  }

  dissectContent() {

  }
}