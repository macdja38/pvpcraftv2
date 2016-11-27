/**
 * Created by macdja38 on 2016-11-26.
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MusicPlayer = undefined;

require("babel-core/register");

require("source-map-support/register");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class MusicPlayer {
  constructor(adapter, guild, text, voice, queue, musicDB, music) {
    this._adapter = adapter;
    this._musicDB = musicDB;
    this.music = music;
    this.guild = guild;
    this.text = text;
    this.voice = voice;
    this.queue = queue;
    if (queue && queue.length > 0) {
      this.init(voice.id).then(() => {
        this.play();
      });
    }
  }

  init(channel) {
    var _this = this;

    return _asyncToGenerator(function* () {
      return _this._adapter.joinVoiceChannel(channel).then(function (connection) {
        _this.connection = connection;
      });
    })();
  }

  add(video) {}

  play() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      if (_this2.queue.length > 0) {
        console.log("queue", _this2.queue);
        let url = _this2.music.getStreamUrl((yield _this2.music.getCachingInfoLink(_this2.queue[0].link)));
        console.log(url);
        _this2.connection.play(url.url);
      }
    })();
  }

  pause() {}
}

exports.MusicPlayer = MusicPlayer;
exports.default = MusicPlayer;
//# sourceMappingURL=MusicPlayer.js.map