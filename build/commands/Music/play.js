/**
 * Created by macdja38 on 2016-11-28.
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Play = undefined;

require("babel-core/register");

require("source-map-support/register");

var _Command = require("../Command");

var _Command2 = _interopRequireDefault(_Command);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

let requirements = ["Music"];

class Play extends _Command2.default {
  constructor(...args) {
    super(...args, {
      aliases: ['play'],
      module: 'music',
      nodes: ['warframe.alert'],
      requiredModules: ['music'],
      description: "Display the current warframe alerts.",
      usage: []
    });
  }

  exec(command) {
    var _this = this;

    return _asyncToGenerator(function* () {
      _this.modules.music.play(command.guild, command.args[0], command.user);
    })();
  }

  init() {
    console.log("Got init");
  }
}

exports.Play = Play;
exports.default = Play;
//# sourceMappingURL=play.js.map