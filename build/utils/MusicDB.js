/**
 * Created by macdja38 on 2016-11-26.
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.musicDB = undefined;

require("babel-core/register");

require("source-map-support/register");

var _BaseDB = require("./BaseDB");

var _BaseDB2 = _interopRequireDefault(_BaseDB);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log(_BaseDB2.default);

class musicDB extends _BaseDB2.default {
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
    return this.r.table(this.table).insert(status, { conflict: "replace" }).run();
  }

  saveVid(linkHash, link, video) {
    video.id = linkHash;
    video.link = link;
    video.timeFetched = Date.now();
    return this.r.table(this.videoCache).insert(video, { conflict: "replace" }).run();
  }

  getVid(hash) {
    return this.r.table(this.videoCache).get(hash).run();
  }

  saveSearch(string, result) {
    return this.r.table(this.searchCache).insert({ id: string, result: result, timeFetched: Date.now() }, { conflict: "replace" }).run();
  }

  getSearch(string) {
    return this.r.table(this.searchCache).get(string).run();
  }
}

exports.musicDB = musicDB;
exports.default = musicDB;
//# sourceMappingURL=MusicDB.js.map