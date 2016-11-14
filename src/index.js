/**
 * Created by macdja38 on 2016-08-07.
 */

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

var authJSON = new ConfigJSON({fileName: "auth"});
var adaptersJSON = new ConfigJSON({fileName: "adapters"});
console.log(authJSON);
console.log(adaptersJSON);

// End instantiating Objects.

// Start importing adapters

var availableAdapters = adapters();

console.log("availableAdapters", availableAdapters);

var adaptersArray = [];

for (let adapterSettings of adaptersJSON.get("adapters", {stringThrow: "adapters not defined in Adapter.js"})) {
  console.log(adapterSettings.adapter);
  console.log(availableAdapters[0]);
  let foundAdapter = availableAdapters.find(a => a.name === adapterSettings.adapter);
  console.log(foundAdapter);
  adaptersArray.push(new foundAdapter({ adapterSettings}));
}

var commandHandler = new CommandHandler(adaptersArray);

for (let adapter of adaptersArray) {
  adapter.register(commandHandler);
}

var moduleLoader = new ModuleLoader();
moduleLoader.loadAll();

for (let adapter of adaptersArray) {
  adapter.login();
}