/**
 * Created by macdja38 on 2016-11-26.
 */
"use strict";
import "babel-core/register";
import "source-map-support/register";

import BaseDB from "./BaseDB";

console.log(BaseDB);

export class musicDB extends BaseDB {
  constructor(r) {
    super(r);
    this.table = "queue";
    this.searchCache = "searchCache";
    this.videoCache = "videoCache";
    this.ensureTable("queue", {});
    this.ensureTable(this.searchCache);
    this.ensureTable(this.videoCache);
  }

  getAll(...args) {
    return this.r.table(this.table).getAll(...args);
  }

  saveVid(video) {
    this.table(this.videoCache).insert(video);
  }

  saveSearch(string, result) {
    return this.r.table(this.searchCache).insert({id: string, result: result, timeFetched: Date.now()}).run();
  }

  getSearch(string) {
    return this.r.table(this.searchCache).get(string).run();
  }
}

export default musicDB;