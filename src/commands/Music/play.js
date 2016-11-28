/**
 * Created by macdja38 on 2016-11-28.
 */

"use strict";
import "babel-core/register";
import "source-map-support/register";

import Command from "../Command";

let requirements = ["Music"];

export class Play extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ['play', 'alerts'],
      module: 'music',
      nodes: ['warframe.alert'],
      requiredModules: ['music'],
      description: "Display the current warframe alerts.",
      usage: []
    });
  }

  async exec(command) {

  }

  init() {
    console.log("Got init");
  }
}

export default Play;