/**
 * Created by macdja38 on 2016-09-18.
 */
"use strict";
import "babel-core/register";
import "source-map-support/register";

export default class Adapter {
  constructor() {
  }

  register(commandHandler) {
    this._commandHandler = commandHandler;
  }
}