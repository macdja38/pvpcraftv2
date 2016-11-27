"use strict";
import "babel-core/register";
import "source-map-support/register";

import Command from "../Command";

let requirements = ["Warframe"];

export class Alerts extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ['alert', 'alerts'],
      module: 'warframe',
      nodes: ['warframe.alert'],
      description: "Display the current warframe alerts.",
      usage: []
    });
  }

  init() {
    console.log("Got init");
  }
}

export default Alerts;