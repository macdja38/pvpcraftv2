/**
 * Created by macdja38 on 2016-09-20.
 */
"use strict";

import parse from "./CommandParser";
import Commands from "../commands";

export default class CommandHandler{
  constructor() {
    this._pingsRecieved = {};
    this._pingsResponded = {};
    this._pingsDelay = {};
    this._pingsError = {};
    this._commands = [];
    this.loadAllCommands();
  }

  onMessage(message) {
    let userCommand = parse({ message, channel: message.channel, prefixes: ["*"], id: message.client.user.id});
    userCommand.setLanguage("en");
    this._commands.forEach(c => {
      console.log(c.aliases, userCommand.command);
      if (c.aliases.indexOf(userCommand.command) > -1) {
        c.exec(userCommand);
        userCommand.reply("Wow, that's a command");
      }
    });
    console.log("command", userCommand);
  }

  loadAllCommands() {
    this._commands = [];
    console.log(Commands());
    Commands().forEach(c => c.forEach(c => this._commands.push(new c())));
    console.log(this._commands);
    this._commands.forEach(c => c.init());
    console.log("commands", Commands());
  }
}