/**
 * Created by macdja38 on 2016-09-20.
 */

"use strict";
import "babel-core/register";
import "source-map-support/register";

export default class Guild {
  constructor(guild) {
    this._guild = guild;
  }

  getChannel(id) {
    return this._guild.channels.get(id);
  }
}