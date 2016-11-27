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

  saveVid(video) {
    this.table(this.videoCache).insert(video);
  }

  saveSearch(string, result) {
    return this.r.table(this.searchCache).insert({ id: string, result: result, timeFetched: Date.now() }).run();
  }

  getSearch(string) {
    return this.r.table(this.searchCache).get(string).run();
  }
}

exports.musicDB = musicDB;
exports.default = musicDB;
//# sourceMappingURL=MusicDB.js.map