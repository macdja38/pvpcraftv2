/**
 * Created by macdja38 on 2016-11-13.
 */
"use strict";
import "babel-core/register";
import "source-map-support/register";

export class Command {
  constructor(...args) {
    let options = args.pop();
    this.aliases = options.aliases;
    this.modules = {};
  }

  recieveModules(modules) {
    this.modules = modules;
  }
}

export default Command;