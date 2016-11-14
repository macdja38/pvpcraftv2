"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

require("source-map-support/register");

class pvpcraft {
  constructor() {
    this.count = 0;
  }

  inc() {
    return this.count++;
  }

  command(command) {
    command.sendMessage(this.inc);
  }
}
exports.default = pvpcraft; /**
                             * Created by macdja38 on 2016-08-07.
                             */
//# sourceMappingURL=pvpcraft.js.map