/**
 * Created by macdja38 on 2016-09-20.
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

require("babel-core/register");

require("source-map-support/register");

class User {
  constructor(user) {
    this._user = user;
  }

  get user() {
    return this._user;
  }

  get avatar() {
    return this._user.avatar;
  }

  get avatarURL() {
    return this._user.avatarURL;
  }

  get id() {
    return this.user.id;
  }
}
exports.default = User;
//# sourceMappingURL=User.js.map