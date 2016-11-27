/**
 * Created by macdja38 on 2016-11-26.
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Music = undefined;

require("babel-core/register");

require("source-map-support/register");

var _Module = require("./Module");

var _Module2 = _interopRequireDefault(_Module);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

let requirements = ["configDB", "musicDB", "configJSON", "musicPlayer"];

let request = require("request");

let table = "music";

class Music extends _Module2.default {
  constructor({ configDB, authJSON, musicDB, MusicPlayer, adaptersArray }) {
    super();
    this.adapters = adaptersArray;
    this.MusicPlayer = MusicPlayer;
    this.musicDB = musicDB;
    this.players = [];
    this.regionCode = "CA";
    this.apiKey = authJSON.get("apiKeys.youtube", false);
    this.startConnections();
  }

  startConnections() {
    var _this = this;

    this.adapters.forEach((() => {
      var _ref = _asyncToGenerator(function* (a) {
        yield a.ready;
        _this.musicDB.getAll(...a.serverIds).then(function (queues) {
          queues.forEach(function (queue) {
            console.log(queue);
            let guild = a.getGuild(queue.id);
            if (!guild) return;
            let voice = guild.getChannel(queue.voice_id);
            let text = guild.getChannel(queue.text_id);
            if (!text || !voice) return;
            let player = new _this.MusicPlayer(a, guild, text, voice, queue.queue, _this.musicDB, _this);
            // player.init(voice.id);
            _this.cachingSearch("rock and roll");
            _this.players.push(player);
          });
        });
      });

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    })());
  }

  cachingSearch(string) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      let cache = yield _this2.musicDB.getSearch(string);
      if (cache) {
        console.log("Cached", cache);
        return cache;
      }
      let response = yield _this2.search(string);
      _this2.musicDB.saveSearch(string, response).catch(function (error) {
        return console.error;
      });
      console.log(response);
    })();
  }

  search(string) {
    return new Promise((resolve, reject) => {
      let requestUrl = "https://www.googleapis.com/youtube/v3/search" + `?part=snippet&q=${ string }&key=${ this.apiKey }&regionCode=${ this.regionCode }`;
      request({ method: "GET", uri: requestUrl, gzip: true }, (error, response) => {
        if (error) reject(error);
        resolve(JSON.parse(response.body));
      });
    });
  }
}

exports.Music = Music;
exports.default = Music;
//# sourceMappingURL=Music.js.map