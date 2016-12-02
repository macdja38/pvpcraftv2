/**
 * Created by macdja38 on 2016-08-07.
 */
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

var _utils = require("./utils/utils");

var utils = _interopRequireWildcard(_utils);

var _MusicDB = require("./utils/MusicDB");

var _MusicDB2 = _interopRequireDefault(_MusicDB);

var _MusicPlayer = require("./utils/MusicPlayer");

var _MusicPlayer2 = _interopRequireDefault(_MusicPlayer);

var _videoInfo = require("./utils/videoInfo");

var _videoInfo2 = _interopRequireDefault(_videoInfo);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

global.Promise = _bluebird2.default;
// Import sources

//import Warframe from "./Warframe";


// Instantiate Objects

let authJSON = new _configJSON2.default({ fileName: "auth" });
let adaptersJSON = new _configJSON2.default({ fileName: "adapters" });
console.log(authJSON);
console.log(adaptersJSON);

let r = require("rethinkdbdash")({ servers: [authJSON.get("database.rethinkdb", { fallback: false })] });

let musicDB = new _MusicDB2.default(r);

// End instantiating Objects.

// Start importing adapters

let availableAdapters = (0, _adapters2.default)();

console.log("availableAdapters", availableAdapters);

let adaptersArray = [];

let e = {
  utils,
  musicDB,
  MusicDB: _MusicDB2.default,
  MusicPlayer: _MusicPlayer2.default,
  ConfigJSON: _configJSON2.default,
  authJSON,
  videoInfo: _videoInfo2.default,
  adaptersJSON,
  adaptersArray
};

for (let adapterSettings of adaptersJSON.get("adapters", { stringThrow: "adapters not defined in Adapter.js" })) {
  console.log(adapterSettings.adapter);
  console.log(availableAdapters[0]);
  let foundAdapter = availableAdapters.find(a => a.name === adapterSettings.adapter);
  console.log(foundAdapter);
  adaptersArray.push(new foundAdapter({ adapterSettings }));
}

let moduleLoader = new _ModuleLoader2.default(e);

let commandHandler = new _CommandHandler2.default(adaptersArray);

moduleLoader.loadAll();

commandHandler.loadModules(moduleLoader.modules);

commandHandler.loadAllCommands();

for (let adapter of adaptersArray) {
  adapter.register(commandHandler);
}

for (let adapter of adaptersArray) {
  adapter.login();
}
//# sourceMappingURL=index.js.map