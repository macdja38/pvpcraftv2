/**
 * Created by macdja38 on 2016-08-07.
 */
"use strict";
import Bluebird from "bluebird";
global.Promise = Bluebird;
// Import sources
import "babel-core/register";
import "source-map-support/register";
import ConfigJSON from "./utils/configJSON.js";
//import Warframe from "./Warframe";
import adapters from "./adapters";
import ModuleLoader from "./lib/ModuleLoader.js";
import CommandHandler from "./lib/CommandHandler.js";

// Instantiate Objects

let authJSON = new ConfigJSON({fileName: "auth"});
let adaptersJSON = new ConfigJSON({fileName: "adapters"});
console.log(authJSON);
console.log(adaptersJSON);

let r = require("rethinkdbdash")({servers: [authJSON.get("database.rethinkdb", {fallback: false})]});

import * as utils from "./utils/utils";
import MusicDB from "./utils/MusicDB";
import MusicPlayer from "./utils/MusicPlayer"
import videoInfo from "./utils/videoInfo"

let musicDB = new MusicDB(r);

// End instantiating Objects.

// Start importing adapters

let availableAdapters = adapters();

console.log("availableAdapters", availableAdapters);

let adaptersArray = [];

let e = {
  utils,
  musicDB,
  MusicDB,
  MusicPlayer,
  ConfigJSON,
  authJSON,
  videoInfo,
  adaptersJSON,
  adaptersArray,
};

for (let adapterSettings of adaptersJSON.get("adapters", {stringThrow: "adapters not defined in Adapter.js"})) {
  console.log(adapterSettings.adapter);
  console.log(availableAdapters[0]);
  let foundAdapter = availableAdapters.find(a => a.name === adapterSettings.adapter);
  console.log(foundAdapter);
  adaptersArray.push(new foundAdapter({ adapterSettings }));
}

let commandHandler = new CommandHandler(adaptersArray);

for (let adapter of adaptersArray) {
  adapter.register(commandHandler);
}

let moduleLoader = new ModuleLoader(e);

commandHandler.loadModules(moduleLoader.loadAll());

for (let adapter of adaptersArray) {
  adapter.login();
}