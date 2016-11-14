"use strict";

import "source-map-support/register";
import * as path from "path";

import * as fs from "fs";
let dir = fs.readdirSync(__dirname);

export default function() {
  return dir.filter(f => f.indexOf(".") === -1).map(f => importDir(f));
}

function importDir(folder) {
  let folderPath = path.join(__dirname, folder);
  let dir = fs.readdirSync(folderPath);
  return dir.filter(f => f.endsWith(".js") && f !== "index.js" && f !== "Adapter.js").map(f => require(path.join(folderPath,f)).default);
}