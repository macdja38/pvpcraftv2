/**
 * Created by macdja38 on 2016-09-20.
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

require("babel-core/register");

require("source-map-support/register");

class Guild {
  constructor(guild) {
    this._guild = guild;
  }

  get id() {
    return this._guild.id;
  }

  getChannel(id) {
    return this._guild.channels.get(id);
  }
}
exports.default = Guild;
//# sourceMappingURL=Guild.js.map