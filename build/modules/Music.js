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

var _crypto = require("crypto");

var _crypto2 = _interopRequireDefault(_crypto);

var _Module = require("./Module");

var _Module2 = _interopRequireDefault(_Module);

var _request = require("request");

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

let requirements = ["configDB", "musicDB", "configJSON", "musicPlayer"];

let table = "music";

class Music extends _Module2.default {
  constructor({ configDB, videoInfo, authJSON, musicDB, MusicPlayer, adaptersArray }) {
    super();
    this.adapters = adaptersArray;
    this.MusicPlayer = MusicPlayer;
    this.musicDB = musicDB;
    this.videoInfo = videoInfo;
    this.players = new Map([]);
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
            let player = new _this.MusicPlayer(a, guild, text, voice, queue.queue, queue.currentSong, _this.musicDB, _this);
            _this.players.set(guild.id, player);
          });
        });
      });

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    })());
  }

  play(guild, link, user) {
    let player = this.players.get(guild.id);
    player.add(link, user);
  }

  init(guild) {}

  getStreamUrl(info) {
    return this.videoInfo.getStreamUrl(info);
  }

  getCachingInfoLink(link) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      let hashedLink = _crypto2.default.createHash("sha256").update(link).digest("hex");
      return _this2.getCachingInfoHash(hashedLink, link);
    })();
  }

  getCachingInfoHash(hashedLink, link) {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      let cachedInfo = yield _this3.musicDB.getVid(hashedLink);
      console.log("resolving ", hashedLink);
      if (cachedInfo && cachedInfo.hasOwnProperty("timeFetched") && typeof cachedInfo.timeFetched === "number" && Date.now() - cachedInfo.timeFetched < 4 * 60 * 60 * 1000) return cachedInfo;
      let info = yield _this3.videoInfo.getVideoInfo(link);
      console.log("Cache outdated. Fetched new info");
      _this3.musicDB.saveVid(hashedLink, link, info);
      return info;
    })();
  }

  cachingSearch(string) {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      let cache = yield _this4.musicDB.getSearch(string);
      if (cache) return cache;
      let response = yield _this4.search(string);
      _this4.musicDB.saveSearch(string, response).catch(function (error) {
        return console.error;
      });
      console.log(response);
      return response;
    })();
  }

  search(string) {
    return new Promise((resolve, reject) => {
      let requestUrl = "https://www.googleapis.com/youtube/v3/search" + `?part=snippet&q=${ string }&key=${ this.apiKey }&regionCode=${ this.regionCode }`;
      (0, _request2.default)({ method: "GET", uri: requestUrl, gzip: true }, (error, response) => {
        if (error) reject(error);
        resolve(JSON.parse(response.body));
      });
    });
  }

  getCachedDiscordFMPlaylist(id) {
    var _this5 = this;

    return _asyncToGenerator(function* () {
      let cache = yield _this5.musicDB.getDiscordFMPlaylist(id);
      if (cache) return cache;
      let response = yield _this5.getDiscordFMPlaylist(id);
      _this5.musicDB.saveDiscordFMPlaylist(id, response);
      return response;
    })();
  }

  getDiscordFMPlaylist(id) {
    var _this6 = this;

    return _asyncToGenerator(function* () {
      return new Promise(function (resolve, reject) {
        let requestUrl = `https://temp.discord.fm/libraries/${ id }/json`;
        (0, _request2.default)({ method: "GET", uri: requestUrl, gzip: true }, function (error, response) {
          if (error) reject(error);
          resolve(_this6.normalizeDiscordFMPlaylist(JSON.parse(response.body)));
        });
      });
    })();
  }

  normalizeDiscordFMPlaylist(items) {
    return items.map(item => {
      let normalised = {};
      if (item.hasOwnProperty("requestee")) {
        normalised.reqeustee = item.requestee;
      }
      if (item.service === "YouTubeVideo") {
        normalised.url = `https://www.youtube.com/watch?v=${ item.identifier }`;
      } else if (item.service === "SoundCloudTrack") {
        normalised.url = item.url;
      }
      return normalised;
    });
  }
}

exports.Music = Music;
exports.default = Music;
//# sourceMappingURL=Music.js.map