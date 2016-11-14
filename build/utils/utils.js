"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Created by macdja38 on 2016-11-13.
 */

const clean = exports.clean = function clean(text) {
  if (typeof text === "string") {
    return text.replace("``", "`" + String.fromCharCode(8203) + "`").replace("//", "/" + String.fromCharCode(8203) + "/");
  } else {
    return text;
  }
};

exports.default = {
  clean
};
//# sourceMappingURL=utils.js.map