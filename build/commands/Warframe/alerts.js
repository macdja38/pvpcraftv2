"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Alerts = undefined;

require("babel-core/register");

require("source-map-support/register");

var _Command = require("../Command");

var _Command2 = _interopRequireDefault(_Command);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let requirements = ["Warframe"];

class Alerts extends _Command2.default {
  constructor(...args) {
    super(...args, {
      aliases: ['alert', 'alerts'],
      module: ['warframe'],
      nodes: ['warframe.alert'],
      description: "Display the current warframe alerts.",
      usage: []
    });
  }

  init() {
    console.log("Got init");
  }
}

exports.Alerts = Alerts;
exports.default = Alerts;
//# sourceMappingURL=alerts.js.map