/**
 * Created by macdja38 on 2017-01-14.
 */

"use strict";

import "babel-core/register";
import "source-map-support/register";

import EventEmitter from 'events';

export default class Connection extends EventEmitter {
  constructor(connection) {
    super();
    this._connection = connection;
  }
}