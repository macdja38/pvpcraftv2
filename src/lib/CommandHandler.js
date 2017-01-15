/**
 * Created by macdja38 on 2016-09-20.
 */
"use strict";
import "babel-core/register";
import "source-map-support/register";

import parse from "./CommandParser";
import Commands from "../commands";

export default class CommandHandler{
  constructor() {
    this._commands = [];
  }

  onMessage(message) {
    let userCommand = parse({ message, channel: message.channel, prefixes: ["*"], id: message.clientUser.id});
    userCommand.setLanguage("en");
    this._commands.forEach(c => {
      if (c.aliases.indexOf(userCommand.command) > -1) {
        c.exec(userCommand);
      }
    });
  }

  loadModules(modules) {
    this._modules = {};
    modules.forEach(m => this._modules[objectifyConstructorName(m.constructor.name)] = m);
  }

  loadAllCommands() {
    if (!this._modules) throw "Modules not loaded yet! Please load modules before commands";
    this._commands = [];
    Commands().forEach(c => c.forEach(c => this._commands.push(new c())));
    this._commands.forEach(c => c.recieveModules(this._modules));
    this._commands.forEach(c => c.init());
  }

}

function objectifyConstructorName(name) {
  return name.slice(0, 1).toLowerCase() + name.slice(1);
}