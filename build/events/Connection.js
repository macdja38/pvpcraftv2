/**
 * Created by macdja38 on 2017-01-14.
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

require("babel-core/register");

require("source-map-support/register");

var _events = require("events");

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Connection extends _events2.default {
  constructor(connection, client) {
    super();
    this._connection = connection;
    this._client = client;
  }
}
exports.default = Connection;
//# sourceMappingURL=Connection.js.map