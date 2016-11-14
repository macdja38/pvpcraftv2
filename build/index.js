"use strict";

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

require("babel-core/register");

require("source-map-support/register");

var _configJSON = require("./utils/configJSON.js");

var _configJSON2 = _interopRequireDefault(_configJSON);

var _adapters = require("./adapters");

var _adapters2 = _interopRequireDefault(_adapters);

var _ModuleLoader = require("./lib/ModuleLoader.js");

var _ModuleLoader2 = _interopRequireDefault(_ModuleLoader);

var _CommandHandler = require("./lib/CommandHandler.js");

var _CommandHandler2 = _interopRequireDefault(_CommandHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

global.Promise = _bluebird2.default;
// Import sources
/**
 * Created by macdja38 on 2016-08-07.
 */

//import Warframe from "./Warframe";


// Instantiate Objects

var authJSON = new _configJSON2.default({ fileName: "auth" });
var adaptersJSON = new _configJSON2.default({ fileName: "adapters" });
console.log(authJSON);
console.log(adaptersJSON);

// End instantiating Objects.

// Start importing adapters

var availableAdapters = (0, _adapters2.default)();

console.log("availableAdapters", availableAdapters);

var adaptersArray = [];

for (let adapterSettings of adaptersJSON.get("adapters", { stringThrow: "adapters not defined in Adapter.js" })) {
  console.log(adapterSettings.adapter);
  console.log(availableAdapters[0]);
  let foundAdapter = availableAdapters.find(a => a.name === adapterSettings.adapter);
  console.log(foundAdapter);
  adaptersArray.push(new foundAdapter({ adapterSettings }));
}

var commandHandler = new _CommandHandler2.default(adaptersArray);

for (let adapter of adaptersArray) {
  adapter.register(commandHandler);
}

var moduleLoader = new _ModuleLoader2.default();
moduleLoader.loadAll();

for (let adapter of adaptersArray) {
  adapter.login();
}
//# sourceMappingURL=index.js.map