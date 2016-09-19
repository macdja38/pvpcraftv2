/**
 * Created by macdja38 on 2016-08-07.
 */


// Import sources
import "babel-core/register";
import "source-map-support/register";
import ConfigJSON from "./utils/configJSON.js";
//import Warframe from "./Warframe";
import adapters from "./adapters";

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

for (let adapter of adaptersArray) {
  adapter.login();
}