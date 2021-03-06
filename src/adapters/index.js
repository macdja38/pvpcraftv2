"use strict";
import "babel-core/register";
import "source-map-support/register";

import * as path from "path";

import * as fs from "fs";
let dir = fs.readdirSync(__dirname);

export default function() {
  return dir.filter(f => f.endsWith(".js") && f !== "index.js" && f !== "Adapter.js").map(f => require(path.join(__dirname,f)).default);
}
