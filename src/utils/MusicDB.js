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

  saveQueue(info, queue) {
    let status = {
      id: info.id,
      guild_name: info.server.name,
      text: info.text.name,
      text_id: info.text.id,
      voice: info.voice.name,
      voice_id: info.voice.id,
      queue: queue
    };
    return this.r.table(this.table).insert(status, {conflict: "replace"}).run();
  }

  saveVid(linkHash, link, video) {
    video.id = linkHash;
    video.link = link;
    video.timeFetched = Date.now();
    return this.r.table(this.videoCache).insert(video, {conflict: "replace"}).run();
  }

  getVid(hash) {
    return this.r.table(this.videoCache).get(hash).run();
  }

  saveSearch(string, result) {
    return this.r.table(this.searchCache).insert({id: string, result: result, timeFetched: Date.now()}, {conflict: "replace"}).run();
  }

  getSearch(string) {
    return this.r.table(this.searchCache).get(string).run();
  }
}

export default musicDB;