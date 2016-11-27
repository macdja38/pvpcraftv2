/**
 * Created by macdja38 on 2016-09-20.
 */

"use strict";
import "babel-core/register";
import "source-map-support/register";

export default class User {
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