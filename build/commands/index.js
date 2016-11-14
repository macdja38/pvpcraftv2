"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  return dir.filter(f => f.indexOf(".") === -1).map(f => importDir(f));
};

require("source-map-support/register");

var _path = require("path");

var path = _interopRequireWildcard(_path);

var _fs = require("fs");

var fs = _interopRequireWildcard(_fs);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

let dir = fs.readdirSync(__dirname);

function importDir(folder) {
  let folderPath = path.join(__dirname, folder);
  let dir = fs.readdirSync(folderPath);
  return dir.filter(f => f.endsWith(".js") && f !== "index.js" && f !== "Adapter.js").map(f => require(path.join(folderPath, f)).default);
}
//# sourceMappingURL=index.js.map