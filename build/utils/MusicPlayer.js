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
    this.repeat = false;
    if (queue && queue.length > 0) {
      this.init(voice.id).then(() => {
        this.play();
      });
    }
  }

  saveQueue() {
    this._musicDB.saveQueue({
      id: this.guild.id,
      guild_name: this.guild.name,
      text: this.text.name,
      text_id: this.text.id,
      voice: this.voice.name,
      voice_id: this.voice.id
    }, this.queue);
  }

  addListeners(connection, oldConnection) {
    if (oldConnection) {
      this.removeListeners(oldConnection);
    }
    connection.on("end", this.onEnd.bind(this));
    connection.on("warn", this.onWarn.bind(this));
    connection.on("debug", this.onDebug.bind(this));
  }

  removeListeners(oldConnection) {
    oldConnection.removeListener("end", this.onEnd);
    oldConnection.removeListener("warn", this.onWarn);
    oldConnection.removeListener("debug", this.onDebug());
  }

  onEnd(...args) {
    console.error(...args);
    let lastVideo = this.queue.shift();
    if (this.repeat) this.queue.push(lastVideo);
    if (this.queue.length > 0) {
      this.play();
    }
  }

  onWarn(...args) {
    console.error("Warn", ...args);
  }

  onDebug(...args) {
    console.error("Debug", ...args);
  }

  init(channel) {
    var _this = this;

    return _asyncToGenerator(function* () {
      return _this._adapter.joinVoiceChannel(channel).then(function (connection) {
        let oldConnection = _this.connection;
        _this.connection = connection;
        _this.addListeners(connection, oldConnection);
      });
    })();
  }

  add(video) {
    this.queue.push(video);
    this.saveQueue();
  }

  play() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      if (_this2.queue.length > 0) {
        console.log("queue", _this2.queue);
        let url = _this2.music.getStreamUrl((yield _this2.music.getCachingInfoLink(_this2.queue[0].link)));
        console.log(url);
        _this2.connection.play(url.url, { encoderArgs: ["-c", "copy"] });
      }
    })();
  }

  pause() {}
}

exports.MusicPlayer = MusicPlayer;
exports.default = MusicPlayer;
//# sourceMappingURL=MusicPlayer.js.map