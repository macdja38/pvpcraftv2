/**
 * Created by macdja38 on 2016-08-08.
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parse = exports.dissectMessage = exports.getPrefix = undefined;

require("babel-core/register");

require("source-map-support/register");

var _userCommand = require("../Types/userCommand");

var _userCommand2 = _interopRequireDefault(_userCommand);

var _utils = require("../utils/utils.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const regArgs = /^((?:.|\n)*?)(?= -|$)/;
const regFlagsAndOptions = /(?:(?:\s--)(\w+).(\n|.*?)(?= -|\n|$)|(?:\s-)([^-]*?)(?= -|\n|$))/g;

const getPrefix = exports.getPrefix = function (content, prefixes, id) {
  var m = content.trim();
  for (let i in prefixes) {
    if (m.indexOf(prefixes[i].toLowerCase()) === 0) {
      m = m.substr(prefixes[i].length);
      return { prefix: (0, _utils.clean)(prefixes[i]), content: m };
    }
  }
  // see if the user is mentioned
  let mentionRegex = new RegExp(`^<@!?${ id }>`);
  if (mentionRegex.test(m)) {
    m = m.replace(mentionRegex, "");
    return { prefix: `<@${ id }>`, content: m };
  }
  return false;
};

const dissectMessage = exports.dissectMessage = function (content) {
  let args = regArgs.exec(content)[1].trim().split(" ");
  for (let i of args) {
    if (args[i] === "") {
      args.splice(i, 1);
    }
  }
  let command = args.shift();
  let flags = [];
  let options = [];
  var myArray;
  while ((myArray = regFlagsAndOptions.exec(content)) !== null) {
    if (myArray[1] && myArray[2]) {
      options[myArray[1]] = myArray[2];
    }
    if (myArray[3]) {
      flags = flags.concat(myArray[3].split(""));
    }
  }
  return { command, args, options, flags };
};

const parse = exports.parse = function ({ message, channel, prefixes, id }) {
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
  return new _userCommand2.default(options);
};

exports.default = parse;
//# sourceMappingURL=CommandParser.js.map