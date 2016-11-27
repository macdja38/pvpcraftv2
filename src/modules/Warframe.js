"use strict";
import "babel-core/register";
import "source-map-support/register";

import Module from "./Module";

let requirements = ["configDB"];

export class Warframe extends Module {
  constructor() {
    super();
    let alertChannels = [];
    let worldState = [];
  }
}

export default Warframe;