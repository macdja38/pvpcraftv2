/**
 * Created by macdja38 on 2016-08-08.
 */
"use strict";
import "babel-core/register";
import "source-map-support/register";

import Command from "../Types/userCommand";
import { clean } from "../utils/utils.js"

const regArgs = /^((?:.|\n)*?)(?= -|$)/;
const regFlagsAndOptions = /(?:(?:\s--)(\w+).(\n|.*?)(?= -|\n|$)|(?:\s-)([^-]*?)(?= -|\n|$))/g;

export const getPrefix = function (content, prefixes, id) {
  let m = content.trim();
  for (let i in prefixes) {
    if (m.indexOf(prefixes[i].toLowerCase()) === 0) {
      m = m.substr(prefixes[i].length);
      return { prefix: clean(prefixes[i]), content: m };
    }
  }
  // see if the user is mentioned
  let mentionRegex = new RegExp(`^<@!?${id}>`);
  if (mentionRegex.test(m)) {
    m = m.replace(mentionRegex, "");
    return { prefix: `<@${id}>`, content: m };
  }
  return false;
};

export const dissectMessage = function (content) {
  let args = regArgs.exec(content)[1].trim().split(" ");
  for (let i of args) {
    if (args[i] === "") {
      args.splice(i, 1);
    }
  }
  let command = args.shift();
  let flags = [];
  let options = [];
  let myArray;
  while ((myArray = regFlagsAndOptions.exec(content)) !== null) {
    if (myArray[1] && myArray[2]) {
      options[myArray[1]] = myArray[2];
    }
    if (myArray[3]) {
      flags = flags.concat(myArray[3].split(""));
    }
  }
  return { command, args, options, flags }
};

export const parse = function ({message, channel, prefixes, id}) {
  let options = {};
  options.content = message.content;
  options.channel = channel;
  options.message = message;
  options.user = message.author;
  let prefixResult = getPrefix(options.content, prefixes, id);
  if (prefixResult) {
    options.content = prefixResult.content;
    options.prefix = prefixResult.prefix;
    let info = dissectMessage(options.content);
    if (info) {
      options.command = info.command;
      options.args = info.args;
      options.options = info.args;
      options.flags = info.flags;
    }
  }
  return new Command(options);
};

export default parse;